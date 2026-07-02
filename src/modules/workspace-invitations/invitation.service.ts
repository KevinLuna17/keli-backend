import { db } from "../../db";
import { AppError } from "../../shared/errors/app-error";
import { isUniqueViolation } from "../../shared/utils/is-unique-violation";
import * as usersService from "../users/users.service";
import * as workspaceMembersRepository from "../workspace-members/workspace-members.repository";
import * as workspacesRepository from "../workspaces/workspaces.repository";
import {
  getInvitationExpiresAt,
  normalizeInvitationEmail,
} from "./invitation.constants";
import { mapInvitationWithWorkspaceRecord } from "./invitation.mapper";
import * as invitationsRepository from "./invitation.repository";
import { CreateWorkspaceInvitationBodyDto } from "./invitation.schema";
import {
  InvitationResponse,
  InvitationWithWorkspaceRecord,
} from "./invitation.types";

function mapToResponse(
  invitation: InvitationWithWorkspaceRecord,
): InvitationResponse {
  return {
    id: invitation.id,
    workspaceId: invitation.workspaceId,
    workspaceName: invitation.workspaceName,
    workspaceType: invitation.workspaceType,
    invitedEmail: invitation.invitedEmail,
    invitedByUserId: invitation.invitedByUserId,
    invitedByName: invitation.invitedByName,
    status: invitation.status,
    expiresAt: invitation.expiresAt,
    createdAt: invitation.createdAt,
    updatedAt: invitation.updatedAt,
  };
}

async function getInviterName(userId: string): Promise<string | null> {
  const user = await usersService.findById(userId);
  return user?.name?.trim() || null;
}

async function getUserEmailOrThrow(userId: string): Promise<string> {
  const user = await usersService.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  return normalizeInvitationEmail(user.email);
}

async function assertSharedWorkspaceOwner(
  userId: string,
  workspaceId: string,
): Promise<void> {
  const workspace = await workspacesRepository.findById(workspaceId);

  if (!workspace) {
    throw new AppError("Workspace not found", 404, "WORKSPACE_NOT_FOUND");
  }

  if (workspace.type !== "shared") {
    throw new AppError(
      "Invitations are only allowed for shared workspaces",
      400,
      "PERSONAL_WORKSPACE_INVITE_FORBIDDEN",
    );
  }

  const membership = await workspaceMembersRepository.findByWorkspaceAndUser(
    workspaceId,
    userId,
  );

  if (!membership || membership.role !== "owner") {
    throw new AppError(
      "Only workspace owners can perform this action",
      403,
      "WORKSPACE_OWNER_REQUIRED",
    );
  }
}

async function getPendingInvitationForUser(
  userId: string,
  invitationId: string,
) {
  const userEmail = await getUserEmailOrThrow(userId);
  await invitationsRepository.expirePastDuePending(userEmail);

  const invitation = await invitationsRepository.findById(invitationId);

  if (!invitation) {
    throw new AppError("Invitation not found", 404, "INVITATION_NOT_FOUND");
  }

  if (invitation.invitedEmail !== userEmail) {
    throw new AppError(
      "You do not have access to this invitation",
      403,
      "INVITATION_ACCESS_DENIED",
    );
  }

  if (invitation.status !== "pending") {
    throw new AppError(
      "Invitation is no longer pending",
      400,
      "INVITATION_NOT_PENDING",
    );
  }

  if (invitation.expiresAt.getTime() <= Date.now()) {
    await invitationsRepository.updateStatus(invitation.id, "expired");
    throw new AppError("Invitation has expired", 400, "INVITATION_EXPIRED");
  }

  return invitation;
}

export async function syncPendingInvitationsForUser(
  userId: string,
): Promise<void> {
  const userEmail = await getUserEmailOrThrow(userId);
  await invitationsRepository.expirePastDuePending(userEmail);
}

export async function createWorkspaceInvitation(
  userId: string,
  workspaceId: string,
  input: CreateWorkspaceInvitationBodyDto,
): Promise<InvitationResponse> {
  await assertSharedWorkspaceOwner(userId, workspaceId);

  const inviterEmail = await getUserEmailOrThrow(userId);
  const invitedEmail = normalizeInvitationEmail(input.email);

  if (invitedEmail === inviterEmail) {
    throw new AppError(
      "You cannot invite yourself to a workspace",
      400,
      "SELF_INVITE_FORBIDDEN",
    );
  }

  const existingPending =
    await invitationsRepository.findPendingByWorkspaceAndEmail(
      workspaceId,
      invitedEmail,
    );

  if (existingPending) {
    throw new AppError(
      "A pending invitation already exists for this email",
      409,
      "INVITATION_ALREADY_PENDING",
    );
  }

  const alreadyMember = await invitationsRepository.isUserMemberByEmail(
    workspaceId,
    invitedEmail,
  );

  if (alreadyMember) {
    throw new AppError(
      "This user is already a member of the workspace",
      409,
      "INVITEE_ALREADY_MEMBER",
    );
  }

  try {
    const invitation = await invitationsRepository.create({
      workspaceId,
      invitedEmail,
      invitedByUserId: userId,
      expiresAt: getInvitationExpiresAt(),
    });

    const workspace = await workspacesRepository.findById(workspaceId);

    if (!workspace) {
      throw new AppError("Workspace not found", 404, "WORKSPACE_NOT_FOUND");
    }

    const invitedByName = await getInviterName(userId);

    return mapToResponse(
      mapInvitationWithWorkspaceRecord(
        invitation,
        workspace.name,
        workspace.type,
        invitedByName,
      ),
    );
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new AppError(
        "A pending invitation already exists for this email",
        409,
        "INVITATION_ALREADY_PENDING",
      );
    }

    throw error;
  }
}

export async function listPendingInvitationsForUser(
  userId: string,
): Promise<InvitationResponse[]> {
  const userEmail = await getUserEmailOrThrow(userId);
  await invitationsRepository.expirePastDuePending(userEmail);

  const invitations = await invitationsRepository.listPendingByEmail(userEmail);

  return invitations
    .filter((invitation) => invitation.expiresAt.getTime() > Date.now())
    .map(mapToResponse);
}

export async function acceptInvitation(
  userId: string,
  invitationId: string,
): Promise<InvitationResponse> {
  const invitation = await getPendingInvitationForUser(userId, invitationId);

  const alreadyMember = await invitationsRepository.isUserMemberByEmail(
    invitation.workspaceId,
    invitation.invitedEmail,
  );

  if (alreadyMember) {
    const updatedInvitation = await invitationsRepository.updateStatus(
      invitation.id,
      "accepted",
    );

    if (!updatedInvitation) {
      throw new AppError("Invitation not found", 404, "INVITATION_NOT_FOUND");
    }

    const workspace = await workspacesRepository.findById(
      invitation.workspaceId,
    );

    if (!workspace) {
      throw new AppError("Workspace not found", 404, "WORKSPACE_NOT_FOUND");
    }

    const invitedByName = await getInviterName(updatedInvitation.invitedByUserId);

    return mapToResponse(
      mapInvitationWithWorkspaceRecord(
        updatedInvitation,
        workspace.name,
        workspace.type,
        invitedByName,
      ),
    );
  }

  return db.transaction(async (tx) => {
    await workspaceMembersRepository.create(
      {
        workspaceId: invitation.workspaceId,
        userId,
        role: "member",
      },
      tx,
    );

    const updatedInvitation = await invitationsRepository.updateStatus(
      invitation.id,
      "accepted",
      tx,
    );

    if (!updatedInvitation) {
      throw new AppError("Invitation not found", 404, "INVITATION_NOT_FOUND");
    }

    const workspace = await workspacesRepository.findById(
      invitation.workspaceId,
      tx,
    );

    if (!workspace) {
      throw new AppError("Workspace not found", 404, "WORKSPACE_NOT_FOUND");
    }

    const invitedByName = await getInviterName(updatedInvitation.invitedByUserId);

    return mapToResponse(
      mapInvitationWithWorkspaceRecord(
        updatedInvitation,
        workspace.name,
        workspace.type,
        invitedByName,
      ),
    );
  });
}

export async function declineInvitation(
  userId: string,
  invitationId: string,
): Promise<InvitationResponse> {
  const invitation = await getPendingInvitationForUser(userId, invitationId);

  const updatedInvitation = await invitationsRepository.updateStatus(
    invitation.id,
    "declined",
  );

  if (!updatedInvitation) {
    throw new AppError("Invitation not found", 404, "INVITATION_NOT_FOUND");
  }

  const workspace = await workspacesRepository.findById(invitation.workspaceId);

  if (!workspace) {
    throw new AppError("Workspace not found", 404, "WORKSPACE_NOT_FOUND");
  }

  const invitedByName = await getInviterName(updatedInvitation.invitedByUserId);

  return mapToResponse(
    mapInvitationWithWorkspaceRecord(
      updatedInvitation,
      workspace.name,
      workspace.type,
      invitedByName,
    ),
  );
}

export async function cancelInvitation(
  userId: string,
  invitationId: string,
): Promise<void> {
  const invitation = await invitationsRepository.findById(invitationId);

  if (!invitation) {
    throw new AppError("Invitation not found", 404, "INVITATION_NOT_FOUND");
  }

  if (invitation.status !== "pending") {
    throw new AppError(
      "Only pending invitations can be cancelled",
      400,
      "INVITATION_NOT_PENDING",
    );
  }

  await assertSharedWorkspaceOwner(userId, invitation.workspaceId);

  const deleted = await invitationsRepository.deleteById(invitation.id);

  if (!deleted) {
    throw new AppError("Invitation not found", 404, "INVITATION_NOT_FOUND");
  }
}

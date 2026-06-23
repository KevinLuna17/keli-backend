import { db } from "../../db";
import { AppError } from "../../shared/errors/app-error";
import * as provisioningService from "../provisioning/provisioning.service";
import * as workspaceMembersRepository from "../workspace-members/workspace-members.repository";
import { WorkspaceMemberRecord } from "../workspace-members/workspace-member.types";
import { mapWorkspaceToResponse } from "./workspace.mapper";
import * as workspacesRepository from "./workspaces.repository";
import {
  CreateWorkspaceBodyDto,
  UpdateWorkspaceBodyDto,
} from "./workspace.schema";
import {
  CurrentWorkspaceResponse,
  WorkspaceRecord,
  WorkspaceResponse,
} from "./workspace.types";

async function getMembershipOrThrow(
  userId: string,
  workspaceId: string,
): Promise<WorkspaceMemberRecord> {
  const membership = await workspaceMembersRepository.findByWorkspaceAndUser(
    workspaceId,
    userId,
  );

  if (membership) {
    return membership;
  }

  const workspace = await workspacesRepository.findById(workspaceId);

  if (!workspace) {
    throw new AppError("Workspace not found", 404, "WORKSPACE_NOT_FOUND");
  }

  if (workspace.ownerId === userId) {
    return {
      id: "",
      workspaceId: workspace.id,
      userId,
      role: "owner",
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
    };
  }

  throw new AppError(
    "You do not have access to this workspace",
    403,
    "WORKSPACE_ACCESS_DENIED",
  );
}

async function assertWorkspaceOwner(
  userId: string,
  workspaceId: string,
): Promise<WorkspaceRecord> {
  const workspace = await workspacesRepository.findById(workspaceId);

  if (!workspace) {
    throw new AppError("Workspace not found", 404, "WORKSPACE_NOT_FOUND");
  }

  const membership = await getMembershipOrThrow(userId, workspaceId);

  if (membership.role !== "owner") {
    throw new AppError(
      "Only workspace owners can perform this action",
      403,
      "WORKSPACE_OWNER_REQUIRED",
    );
  }

  return workspace;
}

export async function assertWorkspaceAccess(
  userId: string,
  workspaceId: string,
): Promise<void> {
  await getMembershipOrThrow(userId, workspaceId);
}

export async function listWorkspaces(
  userId: string,
): Promise<WorkspaceResponse[]> {
  const workspaces = await workspacesRepository.listByUserId(userId);

  return workspaces.map(({ workspace, role }) =>
    mapWorkspaceToResponse(workspace, role),
  );
}

export async function createSharedWorkspace(
  userId: string,
  input: CreateWorkspaceBodyDto,
): Promise<WorkspaceResponse> {
  return db.transaction(async (tx) => {
    const workspace = await workspacesRepository.create(
      {
        name: input.name,
        type: "shared",
        ownerId: userId,
      },
      tx,
    );

    await workspaceMembersRepository.create(
      {
        workspaceId: workspace.id,
        userId,
        role: "owner",
      },
      tx,
    );

    await provisioningService.seedDefaultCategoriesForWorkspace(workspace.id, tx);

    return mapWorkspaceToResponse(workspace, "owner");
  });
}

export async function updateWorkspace(
  userId: string,
  workspaceId: string,
  input: UpdateWorkspaceBodyDto,
): Promise<WorkspaceResponse> {
  const workspace = await assertWorkspaceOwner(userId, workspaceId);

  const updatedWorkspace = await workspacesRepository.updateName(
    workspace.id,
    input.name,
  );

  if (!updatedWorkspace) {
    throw new AppError("Workspace not found", 404, "WORKSPACE_NOT_FOUND");
  }

  return mapWorkspaceToResponse(updatedWorkspace, "owner");
}

export async function deleteWorkspace(
  userId: string,
  workspaceId: string,
): Promise<void> {
  const workspace = await assertWorkspaceOwner(userId, workspaceId);

  if (workspace.type === "personal") {
    throw new AppError(
      "Personal workspaces cannot be deleted",
      400,
      "PERSONAL_WORKSPACE_DELETE_FORBIDDEN",
    );
  }

  await db.transaction(async (tx) => {
    await workspaceMembersRepository.softDeleteByWorkspaceId(workspace.id, tx);

    const deletedWorkspace = await workspacesRepository.softDelete(
      workspace.id,
      tx,
    );

    if (!deletedWorkspace) {
      throw new AppError("Workspace not found", 404, "WORKSPACE_NOT_FOUND");
    }
  });
}

export async function getCurrentWorkspace(
  userId: string,
): Promise<CurrentWorkspaceResponse> {
  const personalWorkspace = await workspacesRepository.findPersonalByOwnerId(
    userId,
  );

  if (!personalWorkspace) {
    throw new AppError(
      "Personal workspace not found",
      404,
      "PERSONAL_WORKSPACE_NOT_FOUND",
    );
  }

  const membership = await workspaceMembersRepository.findByWorkspaceAndUser(
    personalWorkspace.id,
    userId,
  );

  return {
    id: personalWorkspace.id,
    name: personalWorkspace.name,
    type: personalWorkspace.type,
    role: membership?.role ?? "owner",
  };
}

import { AppError } from "../../shared/errors/app-error";
import * as workspaceService from "../workspaces/workspace.service";
import * as workspacesRepository from "../workspaces/workspaces.repository";
import { mapWorkspaceMemberToResponse } from "./workspace-member.mapper";
import * as workspaceMembersRepository from "./workspace-members.repository";
import { WorkspaceMemberResponse } from "./workspace-member.types";

export async function listWorkspaceMembers(
  userId: string,
  workspaceId: string,
): Promise<WorkspaceMemberResponse[]> {
  await workspaceService.assertWorkspaceAccess(userId, workspaceId);

  const workspace = await workspacesRepository.findById(workspaceId);

  if (!workspace) {
    throw new AppError("Workspace not found", 404, "WORKSPACE_NOT_FOUND");
  }

  const members = await workspaceMembersRepository.listByWorkspaceId(workspaceId);

  return members
    .map(mapWorkspaceMemberToResponse)
    .sort((left, right) => {
      if (left.role !== right.role) {
        return left.role === "owner" ? -1 : 1;
      }

      const leftLabel = left.name?.trim() || left.email;
      const rightLabel = right.name?.trim() || right.email;
      return leftLabel.localeCompare(rightLabel);
    });
}

export async function removeWorkspaceMember(
  userId: string,
  workspaceId: string,
  memberId: string,
): Promise<void> {
  const workspace = await workspacesRepository.findById(workspaceId);

  if (!workspace) {
    throw new AppError("Workspace not found", 404, "WORKSPACE_NOT_FOUND");
  }

  if (workspace.type === "personal") {
    throw new AppError(
      "Personal workspaces cannot contain additional members",
      400,
      "PERSONAL_WORKSPACE_MEMBERS_FORBIDDEN",
    );
  }

  const requesterMembership =
    await workspaceMembersRepository.findByWorkspaceAndUser(workspaceId, userId);

  if (!requesterMembership || requesterMembership.role !== "owner") {
    throw new AppError(
      "Only workspace owners can perform this action",
      403,
      "WORKSPACE_OWNER_REQUIRED",
    );
  }

  const targetMember = await workspaceMembersRepository.findById(memberId);

  if (!targetMember || targetMember.workspaceId !== workspaceId) {
    throw new AppError("Member not found", 404, "WORKSPACE_MEMBER_NOT_FOUND");
  }

  if (targetMember.userId === userId) {
    throw new AppError(
      "Workspace owners cannot remove themselves",
      400,
      "CANNOT_REMOVE_SELF",
    );
  }

  if (targetMember.role === "owner") {
    throw new AppError(
      "Workspace owners cannot be removed",
      400,
      "CANNOT_REMOVE_OWNER",
    );
  }

  const removedMember = await workspaceMembersRepository.softDeleteById(memberId);

  if (!removedMember) {
    throw new AppError("Member not found", 404, "WORKSPACE_MEMBER_NOT_FOUND");
  }
}

import { AppError } from "../../shared/errors/app-error";
import * as categoriesRepository from "../categories/categories.repository";
import * as workspaceMembersRepository from "../workspace-members/workspace-members.repository";
import * as workspacesRepository from "../workspaces/workspaces.repository";
import { CurrentWorkspaceResponse } from "./workspace.types";

async function assertWorkspaceAccess(
  userId: string,
  workspaceId: string,
): Promise<void> {
  const membership = await workspaceMembersRepository.findByWorkspaceAndUser(
    workspaceId,
    userId,
  );

  if (membership) {
    return;
  }

  const workspace = await workspacesRepository.findById(workspaceId);

  if (!workspace) {
    throw new AppError("Workspace not found", 404, "WORKSPACE_NOT_FOUND");
  }

  if (workspace.ownerId === userId) {
    return;
  }

  throw new AppError(
    "You do not have access to this workspace",
    403,
    "WORKSPACE_ACCESS_DENIED",
  );
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

export { assertWorkspaceAccess };

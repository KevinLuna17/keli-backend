import { DEFAULT_CATEGORIES } from "../../shared/constants/default-categories";
import { isUniqueViolation } from "../../shared/utils/is-unique-violation";
import { DbTransaction } from "../../db";
import * as categoriesRepository from "../categories/categories.repository";
import { UserRecord } from "../users/user.types";
import * as usersRepository from "../users/users.repository";
import * as workspaceMembersRepository from "../workspace-members/workspace-members.repository";
import * as workspacesRepository from "../workspaces/workspaces.repository";
import { WorkspaceRecord } from "../workspaces/workspace.types";

function getFirstName(name: string | null): string | null {
  if (!name?.trim()) {
    return null;
  }

  return name.trim().split(/\s+/)[0] ?? null;
}

export function buildPersonalWorkspaceName(name: string | null): string {
  const firstName = getFirstName(name);

  if (firstName) {
    return `${firstName}'s Finances`;
  }

  return "My Finances";
}

async function ensureDefaultCategories(
  workspaceId: string,
  tx: DbTransaction,
): Promise<void> {
  const existingCategories = await categoriesRepository.listByWorkspaceId(
    workspaceId,
    tx,
  );

  const existingKeys = new Set(
    existingCategories.map(
      (category) => `${category.type}:${category.name.toLowerCase()}`,
    ),
  );

  const missingCategories = DEFAULT_CATEGORIES.filter(
    (category) =>
      !existingKeys.has(`${category.type}:${category.name.toLowerCase()}`),
  );

  if (missingCategories.length === 0) {
    return;
  }

  await categoriesRepository.createMany(
    missingCategories.map((category) => ({
      workspaceId,
      name: category.name,
      type: category.type,
      iconKey: category.iconKey,
    })),
    tx,
  );
}

async function ensurePersonalWorkspace(
  user: UserRecord,
  tx: DbTransaction,
): Promise<WorkspaceRecord> {
  let workspace = await workspacesRepository.findPersonalByOwnerId(user.id, tx);

  if (!workspace) {
    try {
      workspace = await workspacesRepository.create(
        {
          name: buildPersonalWorkspaceName(user.name),
          type: "personal",
          ownerId: user.id,
        },
        tx,
      );
    } catch (error) {
      if (!isUniqueViolation(error)) {
        throw error;
      }

      workspace = await workspacesRepository.findPersonalByOwnerId(user.id, tx);

      if (!workspace) {
        throw error;
      }
    }
  }

  const membership = await workspaceMembersRepository.findByWorkspaceAndUser(
    workspace.id,
    user.id,
    tx,
  );

  if (!membership) {
    try {
      await workspaceMembersRepository.create(
        {
          workspaceId: workspace.id,
          userId: user.id,
          role: "owner",
        },
        tx,
      );
    } catch (error) {
      if (!isUniqueViolation(error)) {
        throw error;
      }
    }
  }

  await ensureDefaultCategories(workspace.id, tx);

  return workspace;
}

export async function provisionPersonalWorkspace(
  user: UserRecord,
  tx: DbTransaction,
): Promise<WorkspaceRecord> {
  return ensurePersonalWorkspace(user, tx);
}

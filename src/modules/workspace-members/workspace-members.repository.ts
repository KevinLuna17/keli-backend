import { and, eq, isNull } from "drizzle-orm";
import { db, DbClient, DbTransaction } from "../../db";
import { workspaceMembersTable } from "../../db/schema/workspace-members-schema";
import { mapWorkspaceMemberRowToRecord } from "./workspace-member.mapper";
import {
  CreateWorkspaceMemberInput,
  WorkspaceMemberRecord,
} from "./workspace-member.types";

type DbExecutor = DbClient | DbTransaction;

export async function findByWorkspaceAndUser(
  workspaceId: string,
  userId: string,
  executor: DbExecutor = db,
): Promise<WorkspaceMemberRecord | null> {
  const [row] = await executor
    .select()
    .from(workspaceMembersTable)
    .where(
      and(
        eq(workspaceMembersTable.workspaceId, workspaceId),
        eq(workspaceMembersTable.userId, userId),
        isNull(workspaceMembersTable.deleted_at),
      ),
    )
    .limit(1);

  if (!row) {
    return null;
  }

  return mapWorkspaceMemberRowToRecord(row);
}

export async function create(
  input: CreateWorkspaceMemberInput,
  executor: DbExecutor = db,
): Promise<WorkspaceMemberRecord> {
  const [row] = await executor
    .insert(workspaceMembersTable)
    .values({
      workspaceId: input.workspaceId,
      userId: input.userId,
      role: input.role,
    })
    .returning();

  return mapWorkspaceMemberRowToRecord(row);
}

export async function findOwnerMembershipForUser(
  userId: string,
  executor: DbExecutor = db,
): Promise<WorkspaceMemberRecord | null> {
  const [row] = await executor
    .select()
    .from(workspaceMembersTable)
    .where(
      and(
        eq(workspaceMembersTable.userId, userId),
        eq(workspaceMembersTable.role, "owner"),
        isNull(workspaceMembersTable.deleted_at),
      ),
    )
    .limit(1);

  if (!row) {
    return null;
  }

  return mapWorkspaceMemberRowToRecord(row);
}

export async function softDeleteByWorkspaceId(
  workspaceId: string,
  executor: DbExecutor = db,
): Promise<void> {
  const now = new Date();

  await executor
    .update(workspaceMembersTable)
    .set({
      deleted_at: now,
      updated_at: now,
    })
    .where(
      and(
        eq(workspaceMembersTable.workspaceId, workspaceId),
        isNull(workspaceMembersTable.deleted_at),
      ),
    );
}

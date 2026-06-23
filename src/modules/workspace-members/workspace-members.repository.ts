import { and, asc, eq, isNull } from "drizzle-orm";
import { db, DbClient, DbTransaction } from "../../db";
import { usersTable } from "../../db/schema/usersSchema";
import { workspaceMembersTable } from "../../db/schema/workspace-members-schema";
import {
  mapWorkspaceMemberRowToRecord,
  mapWorkspaceMemberWithUserRow,
} from "./workspace-member.mapper";
import {
  CreateWorkspaceMemberInput,
  WorkspaceMemberRecord,
  WorkspaceMemberWithUserRecord,
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

export async function findById(
  id: string,
  executor: DbExecutor = db,
): Promise<WorkspaceMemberRecord | null> {
  const [row] = await executor
    .select()
    .from(workspaceMembersTable)
    .where(
      and(
        eq(workspaceMembersTable.id, id),
        isNull(workspaceMembersTable.deleted_at),
      ),
    )
    .limit(1);

  if (!row) {
    return null;
  }

  return mapWorkspaceMemberRowToRecord(row);
}

export async function listByWorkspaceId(
  workspaceId: string,
  executor: DbExecutor = db,
): Promise<WorkspaceMemberWithUserRecord[]> {
  const rows = await executor
    .select({
      member: workspaceMembersTable,
      name: usersTable.name,
      email: usersTable.email,
      imageUrl: usersTable.image_url,
    })
    .from(workspaceMembersTable)
    .innerJoin(usersTable, eq(workspaceMembersTable.userId, usersTable.id))
    .where(
      and(
        eq(workspaceMembersTable.workspaceId, workspaceId),
        isNull(workspaceMembersTable.deleted_at),
      ),
    )
    .orderBy(asc(usersTable.name));

  return rows.map((row) =>
    mapWorkspaceMemberWithUserRow({
      ...row.member,
      name: row.name,
      email: row.email,
      imageUrl: row.imageUrl,
    }),
  );
}

export async function softDeleteById(
  id: string,
  executor: DbExecutor = db,
): Promise<WorkspaceMemberRecord | null> {
  const now = new Date();

  const [row] = await executor
    .update(workspaceMembersTable)
    .set({
      deleted_at: now,
      updated_at: now,
    })
    .where(
      and(
        eq(workspaceMembersTable.id, id),
        isNull(workspaceMembersTable.deleted_at),
      ),
    )
    .returning();

  if (!row) {
    return null;
  }

  return mapWorkspaceMemberRowToRecord(row);
}

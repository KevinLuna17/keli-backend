import { and, eq, isNull } from "drizzle-orm";
import { db, DbClient, DbTransaction } from "../../db";
import { workspaceMembersTable } from "../../db/schema/workspace-members-schema";
import { workspacesTable } from "../../db/schema/workspaces-schema";
import { mapWorkspaceRowToRecord } from "./workspace.mapper";
import {
  CreateWorkspaceInput,
  WorkspaceRecord,
  WorkspaceWithMembership,
} from "./workspace.types";

type DbExecutor = DbClient | DbTransaction;

export async function findById(
  id: string,
  executor: DbExecutor = db,
): Promise<WorkspaceRecord | null> {
  const [row] = await executor
    .select()
    .from(workspacesTable)
    .where(
      and(eq(workspacesTable.id, id), isNull(workspacesTable.deleted_at)),
    )
    .limit(1);

  if (!row) {
    return null;
  }

  return mapWorkspaceRowToRecord(row);
}

export async function findPersonalByOwnerId(
  ownerId: string,
  executor: DbExecutor = db,
): Promise<WorkspaceRecord | null> {
  const [row] = await executor
    .select()
    .from(workspacesTable)
    .where(
      and(
        eq(workspacesTable.ownerId, ownerId),
        eq(workspacesTable.type, "personal"),
        isNull(workspacesTable.deleted_at),
      ),
    )
    .limit(1);

  if (!row) {
    return null;
  }

  return mapWorkspaceRowToRecord(row);
}

export async function create(
  input: CreateWorkspaceInput,
  executor: DbExecutor = db,
): Promise<WorkspaceRecord> {
  const [row] = await executor
    .insert(workspacesTable)
    .values({
      name: input.name,
      type: input.type,
      ownerId: input.ownerId,
    })
    .returning();

  return mapWorkspaceRowToRecord(row);
}

export async function listByUserId(
  userId: string,
  executor: DbExecutor = db,
): Promise<WorkspaceWithMembership[]> {
  const rows = await executor
    .select({
      workspace: workspacesTable,
      role: workspaceMembersTable.role,
    })
    .from(workspaceMembersTable)
    .innerJoin(
      workspacesTable,
      eq(workspaceMembersTable.workspaceId, workspacesTable.id),
    )
    .where(
      and(
        eq(workspaceMembersTable.userId, userId),
        isNull(workspaceMembersTable.deleted_at),
        isNull(workspacesTable.deleted_at),
      ),
    )
    .orderBy(workspacesTable.created_at);

  return rows.map((row) => ({
    workspace: mapWorkspaceRowToRecord(row.workspace),
    role: row.role,
  }));
}

export async function updateName(
  id: string,
  name: string,
  executor: DbExecutor = db,
): Promise<WorkspaceRecord | null> {
  const [row] = await executor
    .update(workspacesTable)
    .set({
      name,
      updated_at: new Date(),
    })
    .where(and(eq(workspacesTable.id, id), isNull(workspacesTable.deleted_at)))
    .returning();

  if (!row) {
    return null;
  }

  return mapWorkspaceRowToRecord(row);
}

export async function softDelete(
  id: string,
  executor: DbExecutor = db,
): Promise<WorkspaceRecord | null> {
  const now = new Date();

  const [row] = await executor
    .update(workspacesTable)
    .set({
      deleted_at: now,
      updated_at: now,
    })
    .where(and(eq(workspacesTable.id, id), isNull(workspacesTable.deleted_at)))
    .returning();

  if (!row) {
    return null;
  }

  return mapWorkspaceRowToRecord(row);
}

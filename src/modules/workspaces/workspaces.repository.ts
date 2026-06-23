import { and, eq, isNull } from "drizzle-orm";
import { db, DbClient, DbTransaction } from "../../db";
import { workspacesTable } from "../../db/schema/workspaces-schema";
import { mapWorkspaceRowToRecord } from "./workspace.mapper";
import {
  CreateWorkspaceInput,
  WorkspaceRecord,
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

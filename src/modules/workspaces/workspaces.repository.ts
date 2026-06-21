import { and, eq, isNull } from "drizzle-orm";
import { db } from "../../db";
import { workspacesTable } from "../../db/schema/workspaces-schema";
import { mapWorkspaceRowToRecord } from "./workspace.mapper";
import { WorkspaceRecord } from "./workspace.types";

export async function findById(id: string): Promise<WorkspaceRecord | null> {
  const [row] = await db
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

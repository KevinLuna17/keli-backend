import { and, asc, eq, isNull, lt, sql } from "drizzle-orm";
import { db, DbClient, DbTransaction } from "../../db";
import { usersTable } from "../../db/schema/usersSchema";
import { workspaceInvitationsTable } from "../../db/schema/workspace-invitations-schema";
import { workspaceMembersTable } from "../../db/schema/workspace-members-schema";
import { workspacesTable } from "../../db/schema/workspaces-schema";
import { isUniqueViolation } from "../../shared/utils/is-unique-violation";
import {
  mapInvitationRowToRecord,
  mapInvitationWithWorkspaceRecord,
} from "./invitation.mapper";
import {
  CreateInvitationInput,
  InvitationRecord,
  InvitationStatus,
  InvitationWithWorkspaceRecord,
} from "./invitation.types";

type DbExecutor = DbClient | DbTransaction;

export async function create(
  input: CreateInvitationInput,
  executor: DbExecutor = db,
): Promise<InvitationRecord> {
  const [row] = await executor
    .insert(workspaceInvitationsTable)
    .values({
      workspaceId: input.workspaceId,
      invitedEmail: input.invitedEmail,
      invitedByUserId: input.invitedByUserId,
      expiresAt: input.expiresAt,
      status: "pending",
    })
    .returning();

  return mapInvitationRowToRecord(row);
}

export async function findById(
  id: string,
  executor: DbExecutor = db,
): Promise<InvitationRecord | null> {
  const [row] = await executor
    .select()
    .from(workspaceInvitationsTable)
    .where(eq(workspaceInvitationsTable.id, id))
    .limit(1);

  if (!row) {
    return null;
  }

  return mapInvitationRowToRecord(row);
}

export async function findPendingByWorkspaceAndEmail(
  workspaceId: string,
  invitedEmail: string,
  executor: DbExecutor = db,
): Promise<InvitationRecord | null> {
  const [row] = await executor
    .select()
    .from(workspaceInvitationsTable)
    .where(
      and(
        eq(workspaceInvitationsTable.workspaceId, workspaceId),
        eq(workspaceInvitationsTable.invitedEmail, invitedEmail),
        eq(workspaceInvitationsTable.status, "pending"),
      ),
    )
    .limit(1);

  if (!row) {
    return null;
  }

  return mapInvitationRowToRecord(row);
}

export async function listPendingByEmail(
  invitedEmail: string,
  executor: DbExecutor = db,
): Promise<InvitationWithWorkspaceRecord[]> {
  const rows = await executor
    .select({
      invitation: workspaceInvitationsTable,
      workspaceName: workspacesTable.name,
      workspaceType: workspacesTable.type,
      invitedByName: usersTable.name,
    })
    .from(workspaceInvitationsTable)
    .innerJoin(
      workspacesTable,
      eq(workspaceInvitationsTable.workspaceId, workspacesTable.id),
    )
    .innerJoin(
      usersTable,
      eq(workspaceInvitationsTable.invitedByUserId, usersTable.id),
    )
    .where(
      and(
        eq(workspaceInvitationsTable.invitedEmail, invitedEmail),
        eq(workspaceInvitationsTable.status, "pending"),
        isNull(workspacesTable.deleted_at),
      ),
    )
    .orderBy(asc(workspaceInvitationsTable.created_at));

  return rows.map((row) =>
    mapInvitationWithWorkspaceRecord(
      mapInvitationRowToRecord(row.invitation),
      row.workspaceName,
      row.workspaceType,
      row.invitedByName,
    ),
  );
}

export async function expirePastDuePending(
  invitedEmail: string,
  executor: DbExecutor = db,
): Promise<void> {
  const now = new Date();

  await executor
    .update(workspaceInvitationsTable)
    .set({
      status: "expired",
      updated_at: now,
    })
    .where(
      and(
        eq(workspaceInvitationsTable.invitedEmail, invitedEmail),
        eq(workspaceInvitationsTable.status, "pending"),
        lt(workspaceInvitationsTable.expiresAt, now),
      ),
    );
}

export async function updateStatus(
  id: string,
  status: InvitationStatus,
  executor: DbExecutor = db,
): Promise<InvitationRecord | null> {
  const [row] = await executor
    .update(workspaceInvitationsTable)
    .set({
      status,
      updated_at: new Date(),
    })
    .where(eq(workspaceInvitationsTable.id, id))
    .returning();

  if (!row) {
    return null;
  }

  return mapInvitationRowToRecord(row);
}

export async function isUserMemberByEmail(
  workspaceId: string,
  email: string,
  executor: DbExecutor = db,
): Promise<boolean> {
  const [row] = await executor
    .select({ id: workspaceMembersTable.id })
    .from(workspaceMembersTable)
    .innerJoin(usersTable, eq(workspaceMembersTable.userId, usersTable.id))
    .where(
      and(
        eq(workspaceMembersTable.workspaceId, workspaceId),
        sql`lower(${usersTable.email}) = ${email}`,
        isNull(workspaceMembersTable.deleted_at),
      ),
    )
    .limit(1);

  return Boolean(row);
}

export async function deleteById(
  id: string,
  executor: DbExecutor = db,
): Promise<boolean> {
  const [row] = await executor
    .delete(workspaceInvitationsTable)
    .where(eq(workspaceInvitationsTable.id, id))
    .returning({ id: workspaceInvitationsTable.id });

  return Boolean(row);
}

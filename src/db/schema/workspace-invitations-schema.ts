import { pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { timestamps } from "../../lib/columns.helper";
import { workspaceInvitationStatusEnum } from "./enums";
import { usersTable } from "./usersSchema";
import { workspacesTable } from "./workspaces-schema";

export const workspaceInvitationsTable = pgTable(
  "workspace_invitations",
  {
    id: uuid().primaryKey().defaultRandom(),
    workspaceId: uuid()
      .notNull()
      .references(() => workspacesTable.id),
    invitedEmail: text().notNull(),
    invitedByUserId: text()
      .notNull()
      .references(() => usersTable.id),
    status: workspaceInvitationStatusEnum().notNull().default("pending"),
    expiresAt: timestamp().notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("workspace_invitations_workspace_email_pending_idx")
      .on(table.workspaceId, table.invitedEmail)
      .where(sql`${table.status} = 'pending'`),
  ],
);

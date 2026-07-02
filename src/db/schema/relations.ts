import { relations } from "drizzle-orm";
import { categoriesTable } from "./categories-schema";
import { usersTable } from "./usersSchema";
import { workspaceInvitationsTable } from "./workspace-invitations-schema";
import { workspaceMembersTable } from "./workspace-members-schema";
import { workspacesTable } from "./workspaces-schema";
import {
  transactionsTable,
} from "../../modules/transactions/transaction.table";

export const workspacesRelations = relations(workspacesTable, ({ one, many }) => ({
  owner: one(usersTable, {
    fields: [workspacesTable.ownerId],
    references: [usersTable.id],
  }),
  categories: many(categoriesTable),
  transactions: many(transactionsTable),
  members: many(workspaceMembersTable),
  invitations: many(workspaceInvitationsTable),
}));

export const workspaceMembersRelations = relations(
  workspaceMembersTable,
  ({ one }) => ({
    workspace: one(workspacesTable, {
      fields: [workspaceMembersTable.workspaceId],
      references: [workspacesTable.id],
    }),
    user: one(usersTable, {
      fields: [workspaceMembersTable.userId],
      references: [usersTable.id],
    }),
  }),
);

export const categoriesRelations = relations(categoriesTable, ({ one, many }) => ({
  workspace: one(workspacesTable, {
    fields: [categoriesTable.workspaceId],
    references: [workspacesTable.id],
  }),
  transactions: many(transactionsTable),
}));

export const workspaceInvitationsRelations = relations(
  workspaceInvitationsTable,
  ({ one }) => ({
    workspace: one(workspacesTable, {
      fields: [workspaceInvitationsTable.workspaceId],
      references: [workspacesTable.id],
    }),
    invitedBy: one(usersTable, {
      fields: [workspaceInvitationsTable.invitedByUserId],
      references: [usersTable.id],
    }),
  }),
);

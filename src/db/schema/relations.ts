import { relations } from "drizzle-orm";
import { categoriesTable } from "./categories-schema";
import { usersTable } from "./usersSchema";
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
}));

export const categoriesRelations = relations(categoriesTable, ({ one, many }) => ({
  workspace: one(workspacesTable, {
    fields: [categoriesTable.workspaceId],
    references: [workspacesTable.id],
  }),
  transactions: many(transactionsTable),
}));

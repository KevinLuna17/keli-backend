import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { timestamps } from "../../lib/columns.helper";
import { transactionTypeEnum } from "../../db/schema/enums";
import { categoriesTable } from "../../db/schema/categories-schema";
import { usersTable } from "../../db/schema/usersSchema";
import { workspacesTable } from "../../db/schema/workspaces-schema";

export const transactionsTable = pgTable(
  "transactions",
  {
    id: uuid().primaryKey().defaultRandom(),
    workspaceId: uuid()
      .notNull()
      .references(() => workspacesTable.id),
    categoryId: uuid()
      .notNull()
      .references(() => categoriesTable.id),
    createdBy: text()
      .notNull()
      .references(() => usersTable.id),
    type: transactionTypeEnum().notNull(),
    amountInCents: integer().notNull(),
    description: varchar({ length: 255 }).notNull(),
    transactionDate: timestamp().notNull(),
    ...timestamps,
  },
  (table) => [
    check(
      "transactions_amount_in_cents_positive",
      sql`${table.amountInCents} > 0`,
    ),
    index("transactions_workspace_id_idx").on(table.workspaceId),
    index("transactions_transaction_date_idx").on(table.transactionDate),
    index("transactions_workspace_id_transaction_date_idx").on(
      table.workspaceId,
      table.transactionDate,
    ),
  ],
);

export const transactionsRelations = relations(
  transactionsTable,
  ({ one }) => ({
    workspace: one(workspacesTable, {
      fields: [transactionsTable.workspaceId],
      references: [workspacesTable.id],
    }),
    category: one(categoriesTable, {
      fields: [transactionsTable.categoryId],
      references: [categoriesTable.id],
    }),
    creator: one(usersTable, {
      fields: [transactionsTable.createdBy],
      references: [usersTable.id],
    }),
  }),
);

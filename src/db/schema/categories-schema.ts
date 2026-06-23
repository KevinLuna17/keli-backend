import { pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { timestamps } from "../../lib/columns.helper";
import { transactionTypeEnum } from "./enums";
import { workspacesTable } from "./workspaces-schema";

export const categoriesTable = pgTable(
  "categories",
  {
    id: uuid().primaryKey().defaultRandom(),
    workspaceId: uuid()
      .notNull()
      .references(() => workspacesTable.id),
    name: text().notNull(),
    type: transactionTypeEnum().notNull(),
    iconKey: text().notNull().default("folder"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("categories_workspace_name_type_idx")
      .on(table.workspaceId, table.name, table.type)
      .where(sql`${table.deleted_at} IS NULL`),
  ],
);

import { pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { timestamps } from "../../lib/columns.helper";
import { workspaceTypeEnum } from "./enums";
import { usersTable } from "./usersSchema";

export const workspacesTable = pgTable(
  "workspaces",
  {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    type: workspaceTypeEnum().notNull().default("personal"),
    ownerId: text()
      .notNull()
      .references(() => usersTable.id),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("workspaces_owner_personal_idx")
      .on(table.ownerId)
      .where(
        sql`${table.type} = 'personal' AND ${table.deleted_at} IS NULL`,
      ),
  ],
);

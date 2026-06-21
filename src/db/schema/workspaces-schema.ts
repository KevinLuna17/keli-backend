import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../../lib/columns.helper";
import { usersTable } from "./usersSchema";

export const workspacesTable = pgTable("workspaces", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  ownerId: text()
    .notNull()
    .references(() => usersTable.id),
  ...timestamps,
});

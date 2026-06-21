import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../../lib/columns.helper";
import { workspacesTable } from "./workspaces-schema";

export const categoriesTable = pgTable("categories", {
  id: uuid().primaryKey().defaultRandom(),
  workspaceId: uuid()
    .notNull()
    .references(() => workspacesTable.id),
  name: text().notNull(),
  ...timestamps,
});

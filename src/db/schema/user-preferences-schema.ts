import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../../lib/columns.helper";
import { usersTable } from "./usersSchema";

export const userPreferencesTable = pgTable("user_preferences", {
  id: uuid().primaryKey().defaultRandom(),
  userId: text()
    .notNull()
    .unique()
    .references(() => usersTable.id),
  language: text().notNull().default("en"),
  timezone: text().notNull().default("UTC"),
  ...timestamps,
});

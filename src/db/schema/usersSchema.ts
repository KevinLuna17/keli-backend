import { pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../../lib/columns.helper";

export const usersTable = pgTable("users", {
    id: text().primaryKey(), // Clerk userID
    email: text().notNull(),
    name: text(),
    imageUrl: text(),
    ...timestamps,
});
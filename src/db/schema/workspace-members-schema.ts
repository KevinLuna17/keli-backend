import { pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../../lib/columns.helper";
import { workspaceMemberRoleEnum } from "./enums";
import { usersTable } from "./usersSchema";
import { workspacesTable } from "./workspaces-schema";

export const workspaceMembersTable = pgTable(
  "workspace_members",
  {
    id: uuid().primaryKey().defaultRandom(),
    workspaceId: uuid()
      .notNull()
      .references(() => workspacesTable.id),
    userId: text()
      .notNull()
      .references(() => usersTable.id),
    role: workspaceMemberRoleEnum().notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("workspace_members_workspace_user_idx").on(
      table.workspaceId,
      table.userId,
    ),
  ],
);

import { usersTable } from "../../db/schema/usersSchema";
import { UserRecord } from "./user.types";

type UserRow = typeof usersTable.$inferSelect;

export function mapUserRowToRecord(row: UserRow): UserRecord {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    imageUrl: row.image_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

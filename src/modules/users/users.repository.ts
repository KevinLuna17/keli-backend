import { eq } from "drizzle-orm";
import { db } from "../../db";
import { usersTable } from "../../db/schema/usersSchema";
import { mapUserRowToRecord } from "./user.mapper";
import { CreateUserInput, UserRecord } from "./user.types";

export async function findById(id: string): Promise<UserRecord | null> {
  const [row] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id))
    .limit(1);

  if (!row || row.deleted_at) {
    return null;
  }

  return mapUserRowToRecord(row);
}

export async function create(input: CreateUserInput): Promise<UserRecord> {
  const [row] = await db
    .insert(usersTable)
    .values({
      id: input.id,
      email: input.email,
      name: input.name,
      image_url: input.imageUrl,
    })
    .returning();

  return mapUserRowToRecord(row);
}

export async function updateImageUrl(
  id: string,
  imageUrl: string,
): Promise<UserRecord | null> {
  const [row] = await db
    .update(usersTable)
    .set({
      image_url: imageUrl,
      updated_at: new Date(),
    })
    .where(eq(usersTable.id, id))
    .returning();

  if (!row || row.deleted_at) {
    return null;
  }

  return mapUserRowToRecord(row);
}

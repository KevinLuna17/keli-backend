import { eq } from "drizzle-orm";
import { db } from "../../db";
import { userPreferencesTable } from "../../db/schema/user-preferences-schema";
import { mapPreferencesRowToRecord } from "./preferences.mapper";
import { PreferencesRecord, UpsertPreferencesInput } from "./preferences.types";

export async function findByUserId(
  userId: string,
): Promise<PreferencesRecord | null> {
  const [row] = await db
    .select()
    .from(userPreferencesTable)
    .where(eq(userPreferencesTable.userId, userId))
    .limit(1);

  if (!row) {
    return null;
  }

  return mapPreferencesRowToRecord(row);
}

export async function upsert(
  userId: string,
  input: UpsertPreferencesInput,
): Promise<PreferencesRecord> {
  const existing = await findByUserId(userId);

  const language = input.language ?? existing?.language ?? "en";
  const timezone = input.timezone ?? existing?.timezone ?? "UTC";

  const [row] = await db
    .insert(userPreferencesTable)
    .values({ userId, language, timezone })
    .onConflictDoUpdate({
      target: userPreferencesTable.userId,
      set: { language, timezone, updated_at: new Date() },
    })
    .returning();

  return mapPreferencesRowToRecord(row!);
}

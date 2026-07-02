import { eq } from "drizzle-orm";
import { db } from "../../db";
import { userPreferencesTable } from "../../db/schema/user-preferences-schema";
import { mapPreferencesRowToRecord } from "./preferences.mapper";
import { PreferencesRecord, UpsertPreferencesInput } from "./preferences.types";

/**
 * Inserts user preferences for the first time, or updates only the timezone
 * on subsequent calls. Language is intentionally excluded from the ON CONFLICT
 * update clause — once set it must only change through the user-facing
 * PATCH /preferences endpoint, never via the sync provisioning flow.
 */
export async function initializePreferences(
  userId: string,
  language: string,
  timezone: string,
): Promise<PreferencesRecord> {
  const [row] = await db
    .insert(userPreferencesTable)
    .values({ userId, language, timezone })
    .onConflictDoUpdate({
      target: userPreferencesTable.userId,
      set: {
        timezone,
        updated_at: new Date(),
      },
    })
    .returning();

  return mapPreferencesRowToRecord(row!);
}

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

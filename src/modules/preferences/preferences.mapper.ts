import { userPreferencesTable } from "../../db/schema/user-preferences-schema";
import { PreferencesRecord, PreferencesResponse } from "./preferences.types";

type PreferencesRow = typeof userPreferencesTable.$inferSelect;

export function mapPreferencesRowToRecord(row: PreferencesRow): PreferencesRecord {
  return {
    id: row.id,
    userId: row.userId,
    language: row.language,
    timezone: row.timezone,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapPreferencesRecordToResponse(
  record: PreferencesRecord,
): PreferencesResponse {
  return {
    language: record.language,
    timezone: record.timezone,
  };
}

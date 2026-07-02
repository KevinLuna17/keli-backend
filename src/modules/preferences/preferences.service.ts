import { mapPreferencesRecordToResponse } from "./preferences.mapper";
import * as preferencesRepository from "./preferences.repository";
import { PatchPreferencesBodyDto } from "./preferences.schema";
import { PreferencesResponse } from "./preferences.types";

export async function initializePreferences(
  userId: string,
  language: string,
  timezone: string,
): Promise<void> {
  await preferencesRepository.initializePreferences(userId, language, timezone);
}

const DEFAULT_PREFERENCES: PreferencesResponse = {
  language: "en",
  timezone: "UTC",
};

export async function getPreferences(
  userId: string,
): Promise<PreferencesResponse> {
  const preferences = await preferencesRepository.findByUserId(userId);

  if (!preferences) {
    return DEFAULT_PREFERENCES;
  }

  return mapPreferencesRecordToResponse(preferences);
}

export async function updatePreferences(
  userId: string,
  input: PatchPreferencesBodyDto,
): Promise<PreferencesResponse> {
  const preferences = await preferencesRepository.upsert(userId, {
    language: input.language,
  });

  return mapPreferencesRecordToResponse(preferences);
}

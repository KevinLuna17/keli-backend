export type PreferencesRecord = {
  id: string;
  userId: string;
  language: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date | null;
};

export type PreferencesResponse = {
  language: string;
  timezone: string;
};

export type UpsertPreferencesInput = {
  language?: string;
  timezone?: string;
};

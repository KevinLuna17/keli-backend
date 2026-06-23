export const INVITATION_TTL_DAYS = 7;

export function normalizeInvitationEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function getInvitationExpiresAt(from = new Date()): Date {
  const expiresAt = new Date(from);
  expiresAt.setDate(expiresAt.getDate() + INVITATION_TTL_DAYS);
  return expiresAt;
}

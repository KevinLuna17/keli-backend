export type ProfileResponse = {
  id: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
};

export type UpdateProfileInput = {
  name: string;
  imageUrl?: string | null;
};

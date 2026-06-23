export type UserRecord = {
  id: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date | null;
};

export type CreateUserInput = {
  id: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
};

export type UpdateProfileInput = {
  name: string;
  imageUrl?: string | null;
};

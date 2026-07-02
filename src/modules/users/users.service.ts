import { CreateUserInput, UpdateProfileInput, UserRecord } from "./user.types";
import * as usersRepository from "./users.repository";

export async function ensureUserExists(
  input: CreateUserInput,
): Promise<UserRecord> {
  const existingUser = await usersRepository.findById(input.id);

  if (existingUser) {
    return existingUser;
  }

  return usersRepository.create(input);
}

export async function findById(id: string): Promise<UserRecord | null> {
  return usersRepository.findById(id);
}

export async function updateProfile(
  id: string,
  input: UpdateProfileInput,
): Promise<UserRecord | null> {
  return usersRepository.updateProfile(id, input);
}

import { CreateUserInput, UserRecord } from "./user.types";
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

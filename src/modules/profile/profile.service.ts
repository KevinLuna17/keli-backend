import { AppError } from "../../shared/errors/app-error";
import * as usersRepository from "../users/users.repository";
import { mapUserRecordToProfile } from "./profile.mapper";
import { ProfileResponse, UpdateProfileInput } from "./profile.types";

async function getUserOrThrow(userId: string): Promise<ProfileResponse> {
  const user = await usersRepository.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  return mapUserRecordToProfile(user);
}

export async function getProfile(userId: string): Promise<ProfileResponse> {
  return getUserOrThrow(userId);
}

export async function updateProfile(
  userId: string,
  input: UpdateProfileInput,
): Promise<ProfileResponse> {
  const updatedUser = await usersRepository.updateProfile(userId, input);

  if (!updatedUser) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  return mapUserRecordToProfile(updatedUser);
}

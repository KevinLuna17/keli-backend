import { AppError } from "../../shared/errors/app-error";
import * as usersService from "../users/users.service";
import { mapUserRecordToProfile } from "./profile.mapper";
import { ProfileResponse, UpdateProfileInput } from "./profile.types";

async function getUserOrThrow(userId: string): Promise<ProfileResponse> {
  const user = await usersService.findById(userId);

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
  const updatedUser = await usersService.updateProfile(userId, input);

  if (!updatedUser) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  return mapUserRecordToProfile(updatedUser);
}

import { clerkClient } from "@clerk/express";
import { AppError } from "../../shared/errors/app-error";
import * as usersRepository from "../users/users.repository";
import * as usersService from "../users/users.service";
import { UserRecord } from "../users/user.types";

function getPrimaryEmail(
  clerkUser: Awaited<ReturnType<typeof clerkClient.users.getUser>>,
): string {
  const primaryEmail = clerkUser.emailAddresses.find(
    (email) => email.id === clerkUser.primaryEmailAddressId,
  )?.emailAddress;

  if (!primaryEmail) {
    throw new AppError(
      "Authenticated user does not have a primary email",
      400,
      "USER_EMAIL_MISSING",
    );
  }

  return primaryEmail;
}

function getDisplayName(
  clerkUser: Awaited<ReturnType<typeof clerkClient.users.getUser>>,
): string | null {
  const fullName = [clerkUser.firstName, clerkUser.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || null;
}

export async function syncUser(userId: string): Promise<UserRecord> {
  const existingUser = await usersRepository.findById(userId);

  if (existingUser) {
    if (existingUser.imageUrl) {
      return existingUser;
    }

    const clerkUser = await clerkClient.users.getUser(userId);

    if (clerkUser.imageUrl) {
      const updatedUser = await usersRepository.updateImageUrl(
        userId,
        clerkUser.imageUrl,
      );

      if (updatedUser) {
        return updatedUser;
      }
    }

    return existingUser;
  }

  const clerkUser = await clerkClient.users.getUser(userId);

  return usersService.ensureUserExists({
    id: userId,
    email: getPrimaryEmail(clerkUser),
    name: getDisplayName(clerkUser),
    imageUrl: clerkUser.imageUrl,
  });
}

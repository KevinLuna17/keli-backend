import { clerkClient } from "@clerk/express";
import { db } from "../../db";
import { AppError } from "../../shared/errors/app-error";
import * as provisioningService from "../provisioning/provisioning.service";
import * as invitationService from "../workspace-invitations/invitation.service";
import * as usersRepository from "../users/users.repository";
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
  const shouldFetchClerk =
    !existingUser || !existingUser.imageUrl || !existingUser.name;

  const clerkUser = shouldFetchClerk
    ? await clerkClient.users.getUser(userId)
    : null;

  const user = await db.transaction(async (tx) => {
    let syncedUser = await usersRepository.findById(userId, tx);

    if (!syncedUser) {
      if (!clerkUser) {
        throw new AppError("Authenticated user not found", 404, "USER_NOT_FOUND");
      }

      syncedUser = await usersRepository.create(
        {
          id: userId,
          email: getPrimaryEmail(clerkUser),
          name: getDisplayName(clerkUser),
          imageUrl: clerkUser.imageUrl,
        },
        tx,
      );
    } else if (clerkUser?.imageUrl && !syncedUser.imageUrl) {
      const updatedUser = await usersRepository.updateImageUrl(
        userId,
        clerkUser.imageUrl,
        tx,
      );

      if (updatedUser) {
        syncedUser = updatedUser;
      }
    }

    await provisioningService.provisionPersonalWorkspace(syncedUser, tx);

    return syncedUser;
  });

  await invitationService.syncPendingInvitationsForUser(userId);

  return user;
}

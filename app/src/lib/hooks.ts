import { useClerk } from "@clerk/clerk-react";

/**
 * Gets the user when we know they are logged in.
 */
export function useUser() {
  const { user } = useClerk();
  if (!user) {
    throw new Error("You must be logged in to use this.");
  }

  return user;
}

export function useUserPresence() {
  const { user } = useClerk();
  if (!user) {
    throw new Error("You must be logged in to use this.");
  }

  const avatar = user.imageUrl;
  const name = user.firstName || user.fullName;

  return { avatar, name };
}

export type UserPresence = ReturnType<typeof useUserPresence>;

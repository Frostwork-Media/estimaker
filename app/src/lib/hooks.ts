import { useClerk } from "@clerk/clerk-react";
import { useCallback, useEffect } from "react";
import { useReactFlow } from "reactflow";
import { useStore, useTable } from "tinybase/debug/ui-react";

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
  const name = user.firstName || user.fullName || "Anonymous";
  const id = user.id;

  return { avatar, name, id };
}

export type UserPresence = ReturnType<typeof useUserPresence>;

export function useAvatar() {
  const users = useTable("users");
  const presence = useUserPresence();
  const store = useStore();
  useEffect(() => {
    // Writes the user into storage so avatar is available later
    if (!store) return;
    if (!presence) return;
    if (Object.values(users).some((u) => u.id === presence.id)) return;
    store.addRow("users", presence);
  }, [users, presence, store]);
}

/**
 * Gets the center of the react flow pane, in react flow coordinates.
 */
export function useGetFlowCenter() {
  const { screenToFlowPosition } = useReactFlow();
  return useCallback(() => {
    const element = document.querySelector(".react-flow__pane");
    if (!element) return screenToFlowPosition({ x: 200, y: 200 });

    const rect = element.getBoundingClientRect();
    return screenToFlowPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  }, [screenToFlowPosition]);
}

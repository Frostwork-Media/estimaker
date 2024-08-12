import { create } from "zustand";

type ClientStore = {
  selectedNodes: string[];
  sidebarTab?: "search" | "squiggle";
  isReady: boolean;
};

export const useClientStore = create<ClientStore>()((_set) => ({
  selectedNodes: [],
  isReady: false,
}));

export function setIsReady() {
  useClientStore.setState({ isReady: true });
}

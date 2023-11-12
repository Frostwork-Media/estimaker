import { create } from "zustand";

type ClientStore = {
  selectedNodes: string[];
  sidebarTab?: "search" | "squiggle";
};

export const useClientStore = create<ClientStore>()((_set) => ({
  selectedNodes: [],
}));

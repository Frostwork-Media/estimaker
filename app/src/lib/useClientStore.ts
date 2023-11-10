import { create } from "zustand";

type ClientStore = {
  selectedNodes: string[];
};

export const useClientStore = create<ClientStore>()((_set) => ({
  selectedNodes: [],
}));

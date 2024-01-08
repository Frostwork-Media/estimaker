import { create } from "zustand";

type CursorsStore = { cursors: Record<string, { x: number; y: number }> };

export const useCursorsStore = create<CursorsStore>(() => ({
  cursors: {},
}));

export function setUserPosition(id: string, x: number, y: number) {
  useCursorsStore.setState((state) => {
    return {
      cursors: {
        ...state.cursors,
        [id]: { x, y },
      },
    };
  });
}

export function removeUser(id: string) {
  useCursorsStore.setState((state) => {
    const cursors = { ...state.cursors };
    delete cursors[id];
    return { cursors };
  });
}

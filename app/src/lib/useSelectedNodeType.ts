import { useStore } from "tinybase/debug/ui-react";

export function useSelectedNodeType(id?: string) {
  const store = useStore();
  if (!id) return null;
  return store?.getRow("nodes", id)?.type;
}

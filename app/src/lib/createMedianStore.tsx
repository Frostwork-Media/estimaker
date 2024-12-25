import type { Tables } from "@/lib/store";

export type MedianStore = Record<
  string,
  { avatar: string; value: string; userId: string }[]
>;
export type MedianStoreMedian = MedianStore[keyof MedianStore][number];

export async function createMedianStore(tables: Tables) {
  const medianStore: MedianStore = {};
  const { users, nodes } = tables;
  
  const derivativeNodes = nodes
    ? Object.values(nodes).filter((node) => node.type === "derivative")
    : [];
    
  if (!derivativeNodes.length) return medianStore;

  for (const node of derivativeNodes) {
    if (!("variableName" in node)) continue;
    
    medianStore[node.variableName] = Object.values(users || {}).map(user => ({
      userId: user.id,
      avatar: user.avatar,
      value: node.value
    }));
  }

  return medianStore;
}

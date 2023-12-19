import { run } from "@quri/squiggle-lang";
import { Edge } from "reactflow";

import type { Tables } from "@/lib/store";
import { createSquiggleCode } from "@/lib/useSquiggleCode";

export type MedianStore = Record<
  string,
  { avatar: string; value: number; userId: string }[]
>;
export type MedianStoreMedian = MedianStore[keyof MedianStore][number];

export async function createMedianStore(tables: Tables, edges: Edge[]) {
  try {
    const medianStore: MedianStore = {};

    const { users, nodes } = tables;
    const derivativeNodes = nodes
      ? Object.values(nodes).filter((node) => node.type === "derivative")
      : [];
    if (!derivativeNodes.length) return medianStore;
    for (const userId in users) {
      const user = users[userId];
      const code = createSquiggleCode(tables, edges, user.id);
      for (const node of derivativeNodes) {
        if (!("variableName" in node)) continue;

        // Try it as a distribution first...
        let result = await run(`${code}\nquantile(${node.variableName},0.5)`);
        if (!result.ok) {
          // If it failed, maybe it wasn't distribution
          result = await run(`${code}\n${node.variableName}`);
        }

        if (result.ok && result.value.result._value.type === "Number") {
          const value = result.value.result._value.value;
          if (!medianStore[node.variableName]) {
            medianStore[node.variableName] = [];
          }
          medianStore[node.variableName].push({
            userId: user.id,
            avatar: user.avatar,
            value,
          });
        }
      }
    }

    return medianStore;
  } catch (error) {
    return {};
  }
}

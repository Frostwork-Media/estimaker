import { Edge, Node } from "reactflow";

import { EstimateNodeType } from "./canvasTypes";
import { Link, Tables } from "./store";

/**
 * Real-time Document is the input
 */
export function toNodesAndEdges(
  state: Tables,
  selectedNodes: string[]
): {
  nodes: Node[];
  edges: Edge[];
} {
  const variableToNodeId: Record<string, string> = {};

  const nodes: Node[] = [];
  const edges: Edge[] = [];
  if (state.nodes) {
    for (const id in state.nodes) {
      const node = state.nodes[id];
      variableToNodeId[node.variableName] = id;

      switch (node.type) {
        case "estimate": {
          // get links and add to node
          let links: Link[] = [];
          if (state.links) {
            links = Object.values(state.links)
              .filter((link) => link.nodeId === id)
              .map((link) => {
                const { owner } = link;
                if (state.users) {
                  const presence = Object.values(state.users).find(
                    (user) => user.id === owner
                  );
                  if (presence) return { ...link, presence };
                }
                return link;
              });
          }

          const n: EstimateNodeType = {
            id,
            position: { x: node.x, y: node.y },
            type: "estimate",
            selected: selectedNodes.includes(id),
            data: {
              label: node.name,
              variableName: node.variableName,
              links,
            },
          };

          nodes.push(n);

          break;
        }
        case "derivative": {
          nodes.push({
            id,
            position: { x: node.x, y: node.y },
            type: "derivative",
            selected: selectedNodes.includes(id),
            data: {
              label: node.name,
              value: node.value,
              variableName: node.variableName,
            },
          });

          break;
        }

        case "metaforecast": {
          nodes.push({
            id,
            position: { x: node.x, y: node.y },
            type: "metaforecast",
            selected: selectedNodes.includes(id),
            data: {
              slug: node.slug,
            },
          });

          break;
        }
      }
    }

    // loop only over derivative nodes
    for (const id in state.nodes) {
      const node = state.nodes[id];
      if (node.type !== "derivative") continue;

      const variables = getVariables(node.value);
      for (const variable of variables) {
        const nodeId = variableToNodeId[variable];
        if (!nodeId) continue;

        edges.push({
          id: `${id}-${nodeId}`,
          source: nodeId,
          target: id,
          style: { stroke: "#000" },
        });
      }
    }
  }

  return { nodes, edges };
}

const squiggleReservedWords = ["to"];

/**
 * Finds variables in a value
 */
function getVariables(value: string) {
  const matches = value.matchAll(/([a-z]\w*)/gi);
  const safeMatches: string[] = [];
  for (const match of matches) {
    const variableName = match[1];
    if (squiggleReservedWords.includes(variableName)) continue;
    safeMatches.push(variableName);
  }
  return safeMatches;
}

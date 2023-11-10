import { Node, Edge } from "reactflow";
import { Link, Tables } from "./tinybase-store";
import { EstimateNodeType } from "./canvasTypes";

/**
 * Real-time Document is the input
 */
export function toNodesAndEdges(state: Tables): {
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
            links = Object.values(state.links).filter(
              (link) => link.nodeId === id
            );
          }

          const n: EstimateNodeType = {
            id,
            position: { x: node.x, y: node.y },
            type: "estimate",
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
            data: {
              label: node.name,
              value: node.value,
              variableName: node.variableName,
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

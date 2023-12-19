import { Edge, Node } from "reactflow";

import { EstimateNodeType } from "./canvasTypes";
import { MedianStore } from "./createMedianStore";
import { AnyNode, LinkWithSelfId, Tables } from "./store";

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

export function createEdges(
  variableToNodeId: Record<string, string>,
  nodes?: Record<string, AnyNode>
) {
  const edges: Edge[] = [];

  if (!nodes) return edges;

  // loop only over derivative nodes
  for (const id in nodes) {
    const node = nodes[id];
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

  return edges;
}

export function createVariableToNodeId(state: Tables) {
  const variableToNodeId: Record<string, string> = {};
  if (state.nodes) {
    for (const id in state.nodes) {
      const node = state.nodes[id];
      if (!("variableName" in node)) continue;
      variableToNodeId[node.variableName] = id;
    }
  }
  return variableToNodeId;
}

export function createNodes({
  state,
  selectedNodes,
  variableWithErrorName,
  medianStore,
}: {
  state: Tables;
  selectedNodes: string[];
  variableWithErrorName?: string | null;
  medianStore: MedianStore;
}): Node[] {
  const nodes: Node[] = [];
  if (!state.nodes) return nodes;

  for (const id in state.nodes) {
    const node = state.nodes[id];

    switch (node.type) {
      case "estimate": {
        // get links and add to node
        let links: LinkWithSelfId[] = [];
        if (state.links) {
          links = Object.entries(state.links)
            .filter(([_selfId, link]) => link.nodeId === id)
            .map(([selfId, link]) => {
              const { owner } = link;
              if (state.users) {
                const presence = Object.values(state.users).find(
                  (user) => user.id === owner
                );
                if (presence) return { ...link, selfId, presence };
              }
              return { ...link, selfId };
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
            hasError: node.variableName === variableWithErrorName,
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
            medians: medianStore[node.variableName],
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

      case "image": {
        nodes.push({
          id,
          position: { x: node.x, y: node.y },
          type: "image",
          selected: selectedNodes.includes(id),
          data: {
            url: node.url,
            width: node.width,
            height: node.height,
          },
        });
        break;
      }
    }
  }

  // move all image nodes to the beginning
  nodes.sort((a, b) => {
    if (a.type === "image" && b.type !== "image") return -1;
    if (a.type !== "image" && b.type === "image") return 1;
    return 0;
  });

  return nodes;
}

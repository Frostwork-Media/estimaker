  import { Edge } from "reactflow";
  import t from "toposort";

import type { AnyNode, Link } from './store'
import { Tables } from "./store";

// Why do pass an almost identical function?
export function useSquiggleCode(tables: Tables, edges: Edge[], userId: string, targetVariable?: string) {
  console.log("useSquiggleCode called");
  return createSquiggleCode(tables, edges, userId, targetVariable);
}

/** Here we create the squiggle code */
export function createSquiggleCode(
  tables: Tables,
  edges: Edge[], 
  userId: string,
  targetVariable?: string
) {
  console.log("createSquiggleCode called with:", { tables, userId, edges, targetVariable });
  
  const { nodes, links } = tables
  if (!nodes) return ""

    console.log("Finding target node for variable:", targetVariable);
    const targetNodeId = targetVariable ? findNodeIdByVariable(nodes, targetVariable) : null
    console.log("Found target node:", targetNodeId);

    console.log("Creating dependency pairs from edges");
    const deps = edges
      .filter(e => nodes[e.source] && nodes[e.target])
      .map((e) => [e.source, e.target] as [string, string])
    console.log("Dependencies:", deps);
    
    console.log("Sorting nodes based on dependencies");
    const sorted = targetNodeId 
    ? t.array(
        Array.from(getDependentNodes(targetNodeId, edges)),
        deps.filter(([_, target]) => getDependentNodes(targetNodeId, edges).has(target))
      )
    : t.array(Object.keys(nodes), deps)
    console.log("Sorted nodes:", sorted);

    console.log("Generating squiggle code");
    const squiggleCode = sorted
      .filter((id): id is string => nodes[id] && "variableName" in nodes[id])
      .map((id) => {
        const node = nodes[id]
        if (!('variableName' in node)) {
          return '' // Skip nodes without variableName
        }
        const value = getNodeValue(node, links, id, userId)
        return `${node.variableName} = ${value}`
      })
      .filter(Boolean)
      .join("\n")
    console.log("Raw squiggle code:", squiggleCode);

    console.log("Adding semicolons");
    const lines = squiggleCode.split("\n");
    const newLines = lines.map((line, index) =>
      index !== lines.length - 1 ? line + ";" : line
    );
    const result = newLines.join("\n");
    console.log("Final squiggle code:", result);
    return result;
  }

  function getDependentNodes(target: string, edges: Edge[]): Set<string> {
    console.log("Getting dependent nodes for target:", target);
    const deps = new Set([target]);
    let changed = true;
    while (changed) {
      changed = false;
      edges.forEach(e => {
        if (deps.has(e.target) && !deps.has(e.source)) {
          deps.add(e.source);
          changed = true;
          console.log("Added dependency:", e.source);
        }
      });
    }
    console.log("Final dependencies:", Array.from(deps));
    return deps;
  }



  function findNodeIdByVariable(nodes: Record<string, AnyNode>, targetVariable: string) {
    console.log("Finding node ID for variable:", targetVariable);
    const matchingNodeIds = Object.entries(nodes)
      .filter(([_nodeId, node]) => 
        'variableName' in node && node.variableName === targetVariable
      )
      .map(([nodeId]) => nodeId)

    console.log("Found matching node IDs:", matchingNodeIds);

    if (matchingNodeIds.length > 1) {
      throw new Error(`Multiple nodes found with variable name ${targetVariable}`)
    }

    if (matchingNodeIds.length === 0) {
      return null
    }

    return matchingNodeIds[0]
  }

  function getNodeValue(node: AnyNode, links: Record<string, Link> | undefined, id: string, userId: string): string {
    let value = "1" // default value
    if (node.type === "derivative") {
      value = node.value || "1"
    } else if (node.type === "estimate") {
      if (links) {
        const nodeLinks = Object.values(links).filter(
          (link: Link) => link.nodeId === id
        )
        if (nodeLinks.length > 0) {
          const userLink = nodeLinks.find((link: Link) => link.owner === userId)
          if (!userLink && !nodeLinks[0]) {
            throw new Error(`No valid link found for node ${id}`)
          }
          value = userLink ? userLink.value : nodeLinks[0].value
        }
      }
    }
    return value;
  }
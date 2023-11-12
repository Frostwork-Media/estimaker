import { Edge } from "reactflow";
import t from "toposort";

import { Tables } from "./store";

export function useSquiggleCode(tables: Tables, edges: Edge[], userId: string) {
  return createSquiggleCode(tables, edges, userId);
}

/** Here we create the squiggle code */
function createSquiggleCode(tables: Tables, edges: Edge[], userId: string) {
  const { nodes, links } = tables;
  if (!nodes) return "";
  const deps = edges.map((e) => [e.source, e.target] as [string, string]);
  const sorted = t.array(Object.keys(nodes), deps);
  const squiggleCode = sorted
    .map((id) => {
      const node = nodes[id];
      let value = "1"; // default value
      if (node.type === "derivative") {
        value = node.value;
      } else if (node.type === "estimate") {
        if (links) {
          // find the links for this node
          const nodeLinks = Object.values(links).filter(
            (link) => link.nodeId === id
          );

          if (nodeLinks.length > 0) {
            // find the link for this user
            const userLink = nodeLinks.find((link) => link.owner === userId);

            // if there is a link for this user, use that value
            if (userLink) {
              value = userLink.value;
            }

            // if there is no link for this user, use the first value
            else {
              value = nodeLinks[0].value;
            }
          }
        }
      }
      return `${nodes[id].variableName} = ${value}`;
    })
    .join("\n");
  return squiggleCode;
}

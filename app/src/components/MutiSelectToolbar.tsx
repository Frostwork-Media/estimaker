import { NodeToolbar, Position } from "reactflow";

import { useClientStore } from "@/lib/useClientStore";

export function MultiSelectToolbar() {
  const selectedNodes = useClientStore((state) => state.selectedNodes);
  return (
    <NodeToolbar
      isVisible={selectedNodes.length > 1}
      nodeId={selectedNodes}
      position={Position.Bottom}
    >
      <button>Hello World</button>
    </NodeToolbar>
  );
}

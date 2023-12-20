import { IconPlus } from "@tabler/icons-react";
import { NodeToolbar, Position } from "reactflow";

import { useClientStore } from "@/lib/useClientStore";

import { Button } from "./ui/button";

export function MultiSelectToolbar() {
  const selectedNodes = useClientStore((state) => state.selectedNodes);
  return (
    <NodeToolbar
      isVisible={selectedNodes.length > 1}
      nodeId={selectedNodes}
      position={Position.Bottom}
    >
      <Button leftIcon={IconPlus}>New Project from Selection</Button>
    </NodeToolbar>
  );
}

import { IconPlus, IconTrash } from "@tabler/icons-react";
import { NodeToolbar, Position } from "reactflow";

import { useCreateProjectFromSelection } from "@/lib/mutations";
import { useClientStore } from "@/lib/useClientStore";
import { useDeleteNode } from "@/lib/store";

import { Button } from "./ui/button";

export function MultiSelectToolbar() {
  const selectedNodes = useClientStore((state) => state.selectedNodes);
  const createProjectFromSelection = useCreateProjectFromSelection();
  const deleteNode = useDeleteNode();
  return (
    <NodeToolbar
      isVisible={selectedNodes.length > 1}
      nodeId={selectedNodes}
      position={Position.Bottom}
    >
      <Button
        color="red"
        onClick={() => {
          selectedNodes.forEach(id => deleteNode(id));
        }}
      >
        <IconTrash className="w-4 h-4" />
      </Button>
    </NodeToolbar>
  );
}

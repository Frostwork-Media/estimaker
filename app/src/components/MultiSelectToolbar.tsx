import { IconPlus } from "@tabler/icons-react";
import { NodeToolbar, Position } from "reactflow";

import { useCreateProjectFromSelection } from "@/lib/mutations";
import { useClientStore } from "@/lib/useClientStore";

import { Button } from "./ui/button";

export function MultiSelectToolbar() {
  const selectedNodes = useClientStore((state) => state.selectedNodes);
  const createProjectFromSelection = useCreateProjectFromSelection();
  return (
    <NodeToolbar
      isVisible={selectedNodes.length > 1}
      nodeId={selectedNodes}
      position={Position.Bottom}
    >
      <Button
        leftIcon={IconPlus}
        isLoading={createProjectFromSelection.isPending}
        onClick={() => {
          if (window.confirm("Create new project from selection?")) {
            createProjectFromSelection.mutate();
          }
        }}
      >
        New Project from Selection
      </Button>
    </NodeToolbar>
  );
}

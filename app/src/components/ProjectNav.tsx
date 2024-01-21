import {
  IconFolderFilled,
  IconGraph,
  IconPencil,
  IconSearch,
} from "@tabler/icons-react";
import { useValue } from "tinybase/debug/ui-react";

import { IconButton } from "@/components/ui/button";
import { useClientStore } from "@/lib/useClientStore";

import { RenameProjectDialog } from "./RenameProjectDialog";

export function ProjectNav({ id }: { id: string }) {
  const projectName = useValue("name");

  return (
    <div className="p-2 bg-background border-b border-neutral-300">
      <div className="flex gap-2 justify-between items-center">
        <div className="flex gap-2 items-center">
          <a href="/projects">
            <IconButton icon={IconFolderFilled} />
          </a>
          <RenameProjectDialog id={id}>
            <button className="group flex items-center gap-2 font-extrabold text-2xl border-none bg-transparent p-1 focus:outline-none hover:opacity-50">
              {projectName}
              <IconPencil className="hidden group-hover:block" />
            </button>
          </RenameProjectDialog>
        </div>
        <div className="flex gap-2">
          <IconButton
            icon={IconSearch}
            onClick={() => {
              useClientStore.setState({
                sidebarTab: "search",
                selectedNodes: [],
              });
            }}
          />
          <IconButton
            icon={IconGraph}
            onClick={() => {
              useClientStore.setState({
                sidebarTab: "squiggle",
                selectedNodes: [],
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}

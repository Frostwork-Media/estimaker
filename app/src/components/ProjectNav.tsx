import { IconFolderFilled, IconGraph, IconSearch } from "@tabler/icons-react";
import { useValue } from "tinybase/debug/ui-react";

import { IconButton } from "@/components/ui/button";
import { useClientStore } from "@/lib/useClientStore";

import { useUpdateProjectName } from "../lib/store";

export function ProjectNav() {
  const projectName = useValue("name");
  const updateProjectName = useUpdateProjectName();
  return (
    <div className="p-2 bg-background border-b border-neutral-200">
      <div className="flex gap-2 justify-between items-center">
        <div className="flex gap-2 items-center">
          <a href="/projects">
            <IconButton icon={IconFolderFilled} />
          </a>
          <input
            type="text"
            value={projectName as string}
            className="font-extrabold text-2xl border-none bg-transparent"
            onChange={(e) => {
              updateProjectName(e.target.value);
            }}
          />
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

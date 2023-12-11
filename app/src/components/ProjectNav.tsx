import {
  IconFolderFilled,
  IconGraph,
  IconLoader2,
  IconSearch,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import AutosizeInput from "react-input-autosize";
import { useValue } from "tinybase/debug/ui-react";

import { IconButton } from "@/components/ui/button";
import { useClientStore } from "@/lib/useClientStore";

import { useUpdateProjectName } from "../lib/store";

export function ProjectNav() {
  const projectName = useValue("name");
  const updateProjectName = useUpdateProjectName();
  const [saving, setSaving] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (saving) {
      timer.current = setTimeout(() => {
        setSaving(false);
      }, 1000);
    }

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [saving, projectName]);
  return (
    <div className="p-2 bg-background border-b border-neutral-200">
      <div className="flex gap-2 justify-between items-center">
        <div className="flex gap-2 items-center">
          <a href="/projects">
            <IconButton icon={IconFolderFilled} />
          </a>
          <AutosizeInput
            type="text"
            value={projectName as string}
            inputClassName="font-extrabold text-2xl border-none bg-transparent p-1 focus:outline-none focus:bg-neutral-100"
            onChange={(e) => {
              updateProjectName(e.target.value);
              setSaving(true);
            }}
          />
          {saving ? (
            <IconLoader2 className="animate-spin text-blue-300" />
          ) : null}
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

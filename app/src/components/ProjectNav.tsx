import {
  IconFolderFilled,
  IconGraph,
  IconLoader2,
  IconSearch,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import AutosizeInput from "react-input-autosize";
import { useValue } from "tinybase/debug/ui-react";

import { IconButton } from "@/components/ui/button";
import { useUpdateProjectNameInDB } from "@/lib/mutations";
import { useClientStore } from "@/lib/useClientStore";
import { useDebounce } from "@/lib/useDebounce";

import { useUpdateProjectName } from "../lib/store";

export function ProjectNav({ id }: { id: string }) {
  const projectName = useValue("name");
  const [firstName] = useState(projectName);
  const debouncedProjectName = useDebounce(projectName, 1000);
  const updateProjectName = useUpdateProjectName();

  const { mutateAsync: updateProjectNameInDBMutation, isPending } =
    useUpdateProjectNameInDB();

  useEffect(() => {
    // Don't trigger on first load if values match
    if (firstName === projectName) return;

    if (typeof debouncedProjectName !== "string") return;

    updateProjectNameInDBMutation({
      id,
      name: debouncedProjectName,
    });
  }, [
    debouncedProjectName,
    firstName,
    id,
    projectName,
    updateProjectNameInDBMutation,
  ]);

  // It's loading if the value, and debounced value are different, or isPending
  const loading = debouncedProjectName !== projectName || isPending;

  return (
    <div className="p-2 bg-background border-b border-neutral-300">
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
            }}
          />
          {loading ? (
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

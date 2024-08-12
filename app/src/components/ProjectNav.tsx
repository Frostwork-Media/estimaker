import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconGraph,
  IconPencil,
  IconSearch,
} from "@tabler/icons-react";
import equal from "deep-equal";
import { useEffect, useMemo } from "react";
import { useStore, useValue } from "tinybase/debug/ui-react";

import { IconButton } from "@/components/ui/button";
import { useSaveProject } from "@/lib/mutations";
import { useClientStore } from "@/lib/useClientStore";
import { useProject } from "@/lib/useProject";

import { RenameProjectDialog } from "./RenameProjectDialog";

export function ProjectNav({ id }: { id: string }) {
  const projectName = useValue("name");
  const saveProject = useSaveProject();

  // get the current state of the multiplayer party
  const storeJson = useStoreJson();
  const project = useProject();
  const outOfSync = useMemo(() => {
    try {
      const store = JSON.parse(storeJson ?? "[]");
      return !equal(store, project.state);
    } catch (e) {
      return false;
    }
  }, [project.state, storeJson]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (outOfSync) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [outOfSync]);

  const handleSave = () => {
    if (outOfSync) {
      try {
        const state = JSON.parse(storeJson!);
        saveProject.mutate({ id, state });
      } catch (e) {
        console.error("Error saving project:", e);
      }
    }
  };

  return (
    <div className="p-2 bg-background border-b border-neutral-300">
      <div className="flex gap-2 justify-between items-center">
        <div className="flex gap-2 items-center">
          <a href="/projects">
            <IconButton icon={IconArrowLeft} />
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
            icon={IconDeviceFloppy}
            onClick={handleSave}
            title="Save Project"
            color={outOfSync ? "red" : "neutral"}
            disabled={!outOfSync || saveProject.isPending}
            isLoading={saveProject.isPending}
          />
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

function useStoreJson() {
  const store = useStore();
  return store?.getJson();
}

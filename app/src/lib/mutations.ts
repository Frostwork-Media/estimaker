import { useMutation } from "@tanstack/react-query";
import { Project } from "db";
import { useNavigate } from "react-router-dom";
import { State } from "shared";
import { useStore } from "tinybase/debug/ui-react";

import { queryClient } from "./queryClient";
import { useClientStore } from "./useClientStore";

export function useCreateProject() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/projects/create");
      if (!res.ok) {
        throw new Error("Failed to create project");
      }

      const { project } = (await res.json()) as { project: Project };

      return project;
    },
    onSuccess: (project) => {
      // navigate to the new project
      navigate(`/projects/${project.id}`);

      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
}

export function useDeleteProject() {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/projects/delete?id=${id}`);
      if (!res.ok) {
        throw new Error("Failed to delete project");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
    // optimistically remove this id from the ["projects"] query
    onMutate: async (id: string) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["projects"] });

      // Snapshot the previous value
      const previousProjects = queryClient.getQueryData(["projects"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["projects"], (old: Project[]) => {
        return old.filter((project) => project.id !== id);
      });

      // Return a context object with the snapshotted value
      return { previousProjects };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_err, _variables, context) => {
      if (context)
        queryClient.setQueryData(["projects"], context.previousProjects);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
}

/** Creates a new project using only the selected nodes */
export function useCreateProjectFromSelection() {
  const getSelectedState = useGetSelectedState();
  return useMutation({
    mutationFn: async () => {
      const [tables] = getSelectedState();

      const res = await fetch("/api/projects/create", {
        method: "POST",
        body: JSON.stringify({ state: [tables, { name: "New Project" }] }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Failed to create project");
      }

      const { project } = (await res.json()) as { project: Project };

      return project;
    },
    onSuccess: (project) => {
      // navigate to the new project with a refresh
      window.location.href = `/projects/${project.id}`;
    },
  });
}

/**
 * This function returns the subset of the state that is selected
 */
export function useGetSelectedState() {
  const store = useStore();
  return () => {
    if (!store) throw new Error("Store is not defined");
    const selectedNodes = useClientStore.getState().selectedNodes;
    const [tables, values]: State = JSON.parse(store.getJson());

    // remove any nodes from the nodes table that aren't selected
    if (tables.nodes) {
      for (const id in tables.nodes) {
        if (!selectedNodes.includes(id)) {
          delete tables.nodes[id];
        }
      }
    }

    // remove any links that no longer have nodes
    if (tables.links) {
      for (const id in tables.links) {
        const link = tables.links[id];
        if (!selectedNodes.includes(link.nodeId)) {
          delete tables.links[id];
        }
      }
    }

    return [tables, values];
  };
}

function updateProjectNameInDB(name: string, id: string) {
  return fetch("/api/projects/update-name", {
    method: "POST",
    body: JSON.stringify({ name, id }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function useUpdateProjectNameInDB() {
  return useMutation({
    mutationKey: ["updateProjectNameInDB"],
    mutationFn: async ({ name, id }: { name: string; id: string }) => {
      const res = await updateProjectNameInDB(name, id);
      if (!res.ok) {
        throw new Error("Failed to update project name");
      }

      return res.json() as Promise<{ success: boolean }>;
    },
  });
}

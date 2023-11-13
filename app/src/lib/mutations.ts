import { useMutation } from "@tanstack/react-query";
import { Project } from "db";
import { useNavigate } from "react-router-dom";

import { queryClient } from "./queryClient";

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

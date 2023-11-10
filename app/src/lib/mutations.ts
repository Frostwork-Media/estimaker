import { useMutation } from "@tanstack/react-query";

import { queryClient } from "./queryClient";

export function useCreateProject() {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/projects/create");
      if (!res.ok) {
        throw new Error("Failed to create project");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
}

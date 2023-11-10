import { useQuery } from "@tanstack/react-query";
import type { Project } from "db/types";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects/list");
      const { projects, error } = await res.json();
      if (error) {
        throw new Error(error);
      }
      return projects as Project[];
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
}

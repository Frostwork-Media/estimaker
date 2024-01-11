import { useQuery } from "@tanstack/react-query";
import type { Estimate, Project } from "db";

import { searchManifold } from "./searchManifold";
import { getMetaforecast, searchMetaforecast } from "./searchMetaforecast";

/**
 * List the users projects
 */
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

/**
 * Searches metaforecast for a market
 */
export function useMetaforecastSearch(search: string) {
  return useQuery({
    queryKey: ["metaforecast", search],
    queryFn: () => searchMetaforecast(search),
    staleTime: Infinity,
    enabled: !!search,
    retry: true,
  });
}

/**
 * Searches manifold markets
 */
export function useManifoldSearch(search: string) {
  return useQuery({
    queryKey: ["manifold", search],
    queryFn: () => searchManifold(search),
    staleTime: Infinity,
    enabled: !!search,
    retry: false,
  });
}

/**
 * Searches user estimates at the /api/estimates/search endpoint
 */
export function useEstimateSearch(search: string, projectId: string) {
  return useQuery({
    queryKey: ["estimates", projectId, search],
    queryFn: async () => {
      const res = await fetch(
        `/api/estimates/search?term=${search}&id=${projectId}`
      );
      const { estimates, error } = await res.json();
      if (error) {
        throw new Error(error);
      }
      return estimates as Estimate[];
    },
    staleTime: Infinity,
    enabled: !!search,
  });
}

/**
 * Returns metaforecast question details based on the slug
 */
export function useMetaforecastQuestion(slug: string) {
  return useQuery({
    queryKey: ["metaforecast", slug],
    queryFn: () => getMetaforecast(slug),
    staleTime: Infinity,
  });
}

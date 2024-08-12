import { useContext } from "react";

import { ProjectContext } from "@/components/ProjectContextProvider";

/**
 * Custom hook to use the project context, which
 * is the project that is in the database.
 *
 * @returns The project
 */
export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context.project;
}

/**
 * Get the setProject function from the project context.
 *
 * @returns The setProject function
 */
export function useSetProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useSetProject must be used within a ProjectProvider");
  }
  return context.setProject;
}

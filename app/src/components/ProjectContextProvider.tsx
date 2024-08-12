import type { Project } from "db";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

export const ProjectContext = createContext<{
  project: Project;
  setProject: Dispatch<SetStateAction<Project>>;
}>({
  project: {} as Project,
  setProject: () => {},
});

interface ProjectProviderProps {
  initialProject: Project;
  children: ReactNode;
}

export function ProjectProvider({
  initialProject,
  children,
}: ProjectProviderProps) {
  if (!initialProject) {
    throw new Error("initialProject is required");
  }
  const [project, setProject] = useState<Project>(initialProject);

  return (
    <ProjectContext.Provider value={{ project, setProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

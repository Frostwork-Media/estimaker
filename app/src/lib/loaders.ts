import { defer, LoaderFunction } from "react-router-dom";

async function getProject(id: string) {
  const response = await fetch(`/api/projects/get?id=${id}`);
  if (!response.ok) throw new Error("Failed to project.");
  const { project, error } = await response.json();
  if (error) throw new Error(error);
  return project;
}

export const project: LoaderFunction = async ({ params }) => {
  const id = params.id;
  if (!id) throw new Error("No room ID provided!");
  return defer({ project: getProject(id) });
};

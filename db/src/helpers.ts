import { prisma } from "./db";

export async function getProject(id: string) {
  const project = await prisma.project.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      state: true,
      ownerId: true,
      projectEstimate: {
        select: {
          estimate: true,
        },
      },
    },
  });
  return project;
}

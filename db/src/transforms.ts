import { Estimate } from "@prisma/client";
import type { State } from "shared";
import { prisma } from "./db";

/**
 * Converts the state realtime format into the database format
 */
export const toDatabase = (projectId: string, state: State): SaveProps => {
  const [tables, values] = state;
  const { nodes = {}, links = {} } = tables;

  const estimates = Object.values(links).reduce<Estimate[]>((acc, link) => {
    const estimateNode = nodes[link.nodeId];

    if (!estimateNode) {
      console.log("Estimate node not found");
      return acc;
    }

    const estimate: Estimate = {
      id: link.id,
      ownerId: link.owner,
      description: estimateNode.name,
      value: link.value,
    };

    return [...acc, estimate];
  }, []);

  return {
    projectId,
    name: values.name,
    state,
    estimates,
  };
};

type SaveProps = {
  projectId: string;
  name: string;
  state: State;
  estimates: Estimate[];
};

export async function save({ projectId, name, state, estimates }: SaveProps) {
  try {
    // check which estimates exist
    const existingEstimatesIds = (
      await prisma.estimate.findMany({
        where: {
          id: {
            in: estimates.map((e) => e.id),
          },
        },
        select: {
          id: true,
        },
      })
    ).map((e) => e.id);

    // we can assume the project exists
    const projectUpdate = () =>
      prisma.project.update({
        where: { id: projectId },
        data: {
          name,
          state,
        },
      });

    // if they exist, update them
    const existingEstimates = estimates.filter((e) =>
      existingEstimatesIds.includes(e.id)
    );

    const existingEstimateUpdates = () =>
      existingEstimates.map(({ id, ownerId: _, ...rest }) => {
        return prisma.estimate.update({
          where: { id },
          data: rest,
        });
      });

    // if they don't exist, create them and link to project
    const newEstimates = estimates.filter(
      (e) => !existingEstimatesIds.includes(e.id)
    );
    const newEstimateUpdates = () =>
      newEstimates.map((data) => {
        return prisma.estimate.create({
          data: {
            ...data,
            projectEstimate: {
              create: {
                project: {
                  connect: {
                    id: projectId,
                  },
                },
              },
            },
          },
          include: {
            projectEstimate: true,
          },
        });
      });

    await prisma.$transaction([
      projectUpdate(),
      ...existingEstimateUpdates(),
      ...newEstimateUpdates(),
    ]);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export function load(projectId: string) {
  return prisma.project.findUnique({
    where: { id: projectId },
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
}

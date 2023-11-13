import { Estimate } from "@prisma/client";
import type { State } from "shared";
import { prisma } from "./db";

type E = Pick<Estimate, "id" | "ownerId" | "description" | "value">;

/**
 * Converts the state realtime format into the database format
 */
export const toDatabase = (projectId: string, state: State): SaveProps => {
  const [tables, values] = state;
  const { nodes = {}, links = {} } = tables;

  const estimates = Object.values(links).reduce<E[]>((acc, link) => {
    const estimateNode = nodes[link.nodeId];

    if (!estimateNode) {
      console.log("Estimate node not found");
      return acc;
    }

    const estimate: E = {
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
  estimates: E[];
};

export async function save({ projectId, name, state, estimates }: SaveProps) {
  try {
    // check which estimates exist
    const existingEstimates = await prisma.estimate.findMany({
      where: {
        id: {
          in: estimates.map((e) => e.id),
        },
      },
      select: {
        id: true,
        projectEstimate: {
          select: {
            projectId: true,
          },
        },
      },
    });

    const existingEstimatesIds = existingEstimates.map((e) => e.id);

    /** Create a list of which estimates have no link to this projectId */
    let estimatesToLink: string[] = [];
    for (const estimate of existingEstimates) {
      const linkedProjects = estimate.projectEstimate.map((pe) => pe.projectId);
      if (!linkedProjects.includes(projectId)) {
        estimatesToLink.push(estimate.id);
      }
    }

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
    const existingEstimateUpdateValues = estimates.filter((e) =>
      existingEstimatesIds.includes(e.id)
    );

    // Create links for non-linked estimates
    const linkEstimates = () =>
      estimatesToLink.map((estimateId) => {
        return prisma.projectEstimate.create({
          data: {
            projectId,
            estimateId,
          },
        });
      });

    const existingEstimateUpdates = () =>
      existingEstimateUpdateValues.map(({ id, ownerId: _, ...rest }) => {
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
      ...linkEstimates(),
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

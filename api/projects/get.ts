import { VercelApiHandler } from "@vercel/node";
import { prisma } from "db";
import { State } from "shared";

const handler: VercelApiHandler = async (req, res) => {
  const { id } = req.query;

  const project = await prisma.project.findUnique({
    where: {
      id: id as string,
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

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  // Rebuild the project state according to any changed nodes
  const state = structuredClone(project.state) as State;

  // Synchronize state with estimates in database (name and value)
  for (const pe of project.projectEstimate) {
    const { description, value, id } = pe.estimate;

    // Update the Values first
    const links = state[0].links;
    const nodes = state[0].nodes;
    if (links) {
      for (const linkId in links) {
        const link = links[linkId];
        if (link.id === id) {
          link.value = value;

          // get the related node id
          const nodeId = link.nodeId;
          if (nodes) {
            const node = nodes[nodeId];
            if (node) {
              node.name = description;
            }
          }
        }
      }
    }
  }

  // Update with New State
  project.state = state;

  res.status(200).json({ project });
};

export default handler;

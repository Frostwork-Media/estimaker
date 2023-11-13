import { VercelApiHandler } from "@vercel/node";
import { userFromSession } from "../_auth";
import { prisma } from "db";

const handler: VercelApiHandler = async (req, res) => {
  const [user, email] = await userFromSession(req);
  if (!user || !email) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  // get id from request
  const { id } = req.query;
  if (!id) {
    res.status(400).json({ error: "Missing id" });
    return;
  }

  // make sure user owns project
  const project = await prisma.project.findUnique({
    where: {
      id: id.toString(),
    },
  });

  if (!project || project.ownerId !== user.id) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  // delete project
  const deleteProject = () =>
    prisma.project.delete({
      where: {
        id: id.toString(),
      },
    });

  // delete any estimates which now have no projectestimate links
  const deleteOrphanedEstimates = () =>
    prisma.estimate.deleteMany({
      where: {
        projectEstimate: {
          none: {},
        },
      },
    });

  await prisma.$transaction([deleteProject(), deleteOrphanedEstimates()]);

  res.status(200).json({ success: true });
};

export default handler;

import { prisma } from "db";
import { VercelApiHandler } from "@vercel/node";
import { userFromSession } from "../_auth";

const handler: VercelApiHandler = async (req, res) => {
  const [user, email] = await userFromSession(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { term, id } = req.query;
  if (!term) {
    res.status(400).json({ error: "Missing search term" });
    return;
  }

  if (!id) {
    res.status(400).json({ error: "Missing id" });
    return;
  }

  /** Find the estimates whose name matches the search term and which *don't* have a link to the current project */
  const estimates = await prisma.estimate.findMany({
    where: {
      AND: {
        description: {
          contains: term as string,
        },
        projectEstimate: {
          none: {
            projectId: id as string,
          },
        },
      },
    },
    take: 100,
  });

  res.json({ estimates });
};

export default handler;

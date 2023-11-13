import { VercelApiHandler } from "@vercel/node";
import { userFromSession } from "../_auth";
import { prisma } from "db";

const handler: VercelApiHandler = async (req, res) => {
  const [user, email] = await userFromSession(req);
  if (!user || !email) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const projects = await prisma.project.findMany({
    where: {
      ownerId: user.id,
    },
  });

  res.status(200).json({ projects });
};

export default handler;

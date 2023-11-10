import { VercelApiHandler } from "@vercel/node";
import { prisma } from "db";

const handler: VercelApiHandler = async (req, res) => {
  const { id } = req.query;

  const project = await prisma.project.findUnique({
    where: {
      id: id as string,
    },
  });

  res.status(200).json({ project });
};

export default handler;

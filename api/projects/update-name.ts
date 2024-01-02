import { VercelApiHandler } from "@vercel/node";
import { prisma } from "db";

const handler: VercelApiHandler = async (req, res) => {
  const { name, id } = req.body;
  const project = await prisma.project.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });

  res.json({ success: true });
};

export default handler;

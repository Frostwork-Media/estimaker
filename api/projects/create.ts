import { VercelApiHandler } from "@vercel/node";
import { userFromSession } from "../_auth";
import { prisma } from "db";
import { initialState } from "shared";

const handler: VercelApiHandler = async (req, res) => {
  const [user, email] = await userFromSession(req);
  if (!user || !email) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const project = await prisma.project.create({
    data: {
      name: initialState[1].name,
      ownerId: user.id,
      state: initialState,
    },
  });

  res.status(200).json({ project });
};

export default handler;

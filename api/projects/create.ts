import { VercelApiHandler } from "@vercel/node";
import { userFromSession } from "../_auth";
import { prisma } from "db";
import { State, initialState } from "shared";

const handler: VercelApiHandler = async (req, res) => {
  const [user, email] = await userFromSession(req);
  if (!user || !email) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const state: State = req?.body?.state ?? initialState;

  const project = await prisma.project.create({
    data: {
      name: state[1].name,
      ownerId: user.id,
      state: state,
    },
  });

  res.status(200).json({ project });
};

export default handler;

import { VercelApiHandler } from "@vercel/node";

/**
 * This is a webhook to store the project state in the database.
 *
 * Eventually need to protect it with a secret.
 */
const handler: VercelApiHandler = async (req, res) => {
  const { id, state } = req.body;
  if (!id || !state) {
    console.error("Missing id or state");
    // send a silent 200
    res.status(200).end();
    return;
  }

  console.log(`Saving state: ${id}`);

  // send a silent 200
  res.status(200).end();
};

export default handler;

import { VercelApiHandler } from "@vercel/node";
import { save, toDatabase } from "db";

/**
 * This is a webhook to store the project state in the database.
 *
 * Eventually need to protect it with a secret.
 */
const handler: VercelApiHandler = async (req, res) => {
  console.log("Saving project state to database");
  const { id, state } = req.body;
  if (!id || !state) {
    console.error("Missing id or state");
    // send a silent 200
    res.status(200).end();
    return;
  }

  const db = toDatabase(id, state);
  const success = await save(db);

  if (!success) {
    console.log("Error saving to database");
  }

  // send a silent 200
  res.status(200).end();
};

export default handler;

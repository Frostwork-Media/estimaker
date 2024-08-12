import { VercelApiHandler } from "@vercel/node";
import { save, toDatabase } from "db";

/**
 * This is a webhook to store the project state in the database.
 *
 * Eventually need to protect it with a secret.
 */
const handler: VercelApiHandler = async (req, res) => {
  console.log("Saving project state to database");
  try {
    const { id, state } = req.body;
    if (!id || !state) {
      throw new Error("Missing id or state");
    }

    const db = toDatabase(id, state);
    const success = await save(db);

    if (!success) {
      throw new Error("Error saving to database");
    }

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error(error);
    res.status(200).json({ success: false, error: error.message });
  }
};

export default handler;

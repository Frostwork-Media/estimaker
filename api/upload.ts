import { put } from "@vercel/blob";
import { VercelApiHandler } from "@vercel/node";
import { IncomingForm } from "formidable";
import fs from "fs/promises";

import { BLOB_READ_WRITE_TOKEN } from "./_config";

// Have to use the token in some way to force import.
console.log(BLOB_READ_WRITE_TOKEN.slice(0, 0));

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser
  },
};

const handler: VercelApiHandler = async (req, res) => {
  const filename = req.query.filename as string;

  if (!filename) {
    res.status(400).json({
      error: "No filename provided",
    });
    return;
  }

  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: "Error parsing form data" });
      return;
    }

    if (!files.file) {
      res.status(400).json({ error: "No file provided" });
      return;
    }

    const filepath = files.file[0].filepath;

    // files.file.path contains the path to the uploaded file
    const content = await fs.readFile(filepath);

    const blob = await put(filename, content, {
      access: "public",
    });

    res.status(200).json(blob);
  });
};

export default handler;

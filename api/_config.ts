import { config } from "dotenv";
import path from "path";

config({ path: path.join(__dirname, "..", "app", ".env") });

// if (!process.env.LIVEBLOCKS_SECRET_KEY)
//   throw new Error("Missing LIVEBLOCKS_SECRET_KEY");
// const LIVEBLOCKS_SECRET_KEY = process.env.LIVEBLOCKS_SECRET_KEY;

// export { LIVEBLOCKS_SECRET_KEY };

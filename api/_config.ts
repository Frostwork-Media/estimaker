import { config } from "dotenv";
import path from "path";

config({ path: path.join(__dirname, "..", ".env.local") });

if (!process.env.JWT_PUBLIC_KEY) throw new Error("Missing JWT_PUBLIC_KEY");
const JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY;

if (!process.env.BLOB_READ_WRITE_TOKEN)
  throw new Error("Missing BLOB_READ_WRITE_TOKEN");
const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

export { JWT_PUBLIC_KEY, BLOB_READ_WRITE_TOKEN };

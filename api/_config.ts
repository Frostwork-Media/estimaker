import { config } from "dotenv";
import path from "path";

config({ path: path.join(__dirname, "..", ".env.local") });

if (!process.env.JWT_PUBLIC_KEY) throw new Error("Missing JWT_PUBLIC_KEY");
const JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY;

export { JWT_PUBLIC_KEY };

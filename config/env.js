import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });
//process.env.NODE_ENV is a special variable that tells you which environment the app is running in
//"development" .env.development
//"production"
//"test"
export const {
  PORT,
  NODE_ENV,
  DB_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  ARCJET_ENV,
  ARCJET_KEY,
  QSTASH_TOKEN,
  QSTASH_URL,
  SERVER_URL,
} = process.env;

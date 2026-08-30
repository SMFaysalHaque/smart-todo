import "dotenv/config";

const { PORT, MONGODB_URI, JWT_SECRET } = process.env;

if (!MONGODB_URI) {
  console.error("Missing required environment variable: MONGODB_URI");
  process.exit(1);
}

if (!JWT_SECRET) {
  console.error("Missing required environment variable: JWT_SECRET");
  process.exit(1);
}

export const env = {
  port: Number(PORT) || 5000,
  mongodbUri: MONGODB_URI,
  jwtSecret: JWT_SECRET,
  isProduction: process.env.NODE_ENV === "production",
};

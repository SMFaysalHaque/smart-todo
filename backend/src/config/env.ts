import "dotenv/config";

const { PORT, MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  console.error("Missing required environment variable: MONGODB_URI");
  process.exit(1);
}

export const env = {
  port: Number(PORT) || 5000,
  mongodbUri: MONGODB_URI,
};

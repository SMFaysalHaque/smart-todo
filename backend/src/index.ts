import { env } from "./config/env.js";
import { connectToDatabase } from "./config/db.js";
import { createApp } from "./app.js";

async function start(): Promise<void> {
  await connectToDatabase();

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start the backend:", error);
  process.exit(1);
});

import "dotenv/config";
import { createApp } from "./app.js";

const PORT = Number(process.env.PORT) || 5000;

const app = createApp();

app.listen(PORT, () => {
  console.log(`Smart Todo backend running on http://localhost:${PORT}`);
});

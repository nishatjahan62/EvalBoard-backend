import app from "@/app.js";
import { env } from "@/config/env.js";

const server = app.listen(env.PORT, () => {
  console.log(
    `EvalBoard API running at http://localhost:${env.PORT}`,
  );
});

function shutdown(signal: string) {
  console.log(`${signal} received. Closing server...`);

  server.close((error) => {
    if (error) {
      console.error("Failed to close server:", error);
      process.exitCode = 1;
    }
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
import express from "express";
import cors from "cors";
import helmet from "helmet";

import { env } from "@/config/env.js";
import { rateLimiter } from "@/middleware/rateLimiter.js";
import { errorHandler } from "@/middleware/errorHandler.js";
import routes from "@/routes/index.js";

const app = express();

app.disable("x-powered-by");

app.use(helmet());

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json({ limit: "20kb" }));

app.use(rateLimiter);

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "EvalBoard API is running",
  });
});


app.use("/api", routes);
app.use(errorHandler);

export default app;
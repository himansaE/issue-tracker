import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import authRoutes from "./modules/auth/auth.routes";
import issueRoutes from "./modules/issue/issue.routes";

const app: express.Express = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL ?? "http://localhost:5173",
    credentials: true,
  }),
);
app.use(helmet());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", apiLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    env: env.NODE_ENV,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: err.message ?? "Internal server error",
    });
  },
);

// Connect DB at module load — covers both serverless cold starts and local dev
const dbReady = connectDB().catch(console.error);

if (!process.env.VERCEL) {
  dbReady.then(() => {
    app.listen(env.PORT, () => {
      console.log(
        `Server listening on http://localhost:${env.PORT} [${env.NODE_ENV}]`,
      );
    });
  });
}

export default app;

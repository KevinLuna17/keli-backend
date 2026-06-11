import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import express from "express";
import { getCorsOrigins } from "./config/env";
import { errorHandler } from "./shared/middleware/error-handler";
import { notFoundHandler } from "./shared/middleware/not-found";
import router from "./routes";

const app = express();

app.use(
  cors({
    origin: getCorsOrigins(),
    credentials: true,
  }),
);
app.use(express.json());
app.use(clerkMiddleware());
app.use("/api", router);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

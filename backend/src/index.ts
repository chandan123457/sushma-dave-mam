import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./lib/env.js";
import { errorHandler } from "./lib/http.js";
import { api } from "./routes/index.js";
import { publicUploads } from "./routes/uploads.js";

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: env.frontendOrigin, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use("/uploads", publicUploads);
app.use("/api", api);
app.use((_req, res) => res.status(404).json({ error: "Not found" }));
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`API ready on http://localhost:${env.port}`);
});

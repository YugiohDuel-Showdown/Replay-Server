import express from "express";
import mongoose from "mongoose";
import { Config } from "../global/config";
import { logError, logInfo } from "../global/logger";

// import routes
import { router as mainRouter } from "./routes/main";
import { router as replaysRouter } from "./routes/replays";

const app = express();

export function startServer() {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use((req, res, next) => {
    const startedAt = Date.now();

    logInfo("Incoming request.", {
      method: req.method,
      path: req.originalUrl,
      host: req.headers.host,
      forwardedHost: req.headers["x-forwarded-host"],
      forwardedProto: req.headers["x-forwarded-proto"],
      userAgent: req.headers["user-agent"],
    });

    res.on("finish", () => {
      logInfo("Completed request.", {
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMS: Date.now() - startedAt,
      });
    });

    next();
  });

  // Template Engine
  app.set("view engine", "pug");
  app.set('views', __dirname + '/views');
  app.use('/assets', express.static(__dirname + '/views/assets'));

  app.get("/healthz", (req, res) => {
    res.status(200).send("ok");
  });

  app.get("/readyz", (req, res) => {
    if (mongoose.connection.readyState === 1) {
      res.status(200).send("ready");
      return;
    }

    res.status(503).send("mongodb unavailable");
  });

  // Routes
  app.use("/", mainRouter, replaysRouter);

  app.use((req, res) => {
    logInfo("Route not found.", {
      method: req.method,
      path: req.originalUrl,
    });
    res.status(404).send("not found");
  });

  app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logError("Unhandled request error.", error, {
      method: req.method,
      path: req.originalUrl,
    });

    if (res.headersSent) {
      next(error);
      return;
    }

    res.status(500).send("internal server error");
  });

  app.listen(Config.REPLAY_SERVER_PORT, Config.REPLAY_SERVER_HOST, async () => {
    logInfo("Replay Server is ready to serve.", {
      host: Config.REPLAY_SERVER_HOST,
      port: Config.REPLAY_SERVER_PORT,
      nodeEnv: process.env.NODE_ENV,
    });
  });
}

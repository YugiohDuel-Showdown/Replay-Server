import express from "express";
import mongoose from "mongoose";
import { Config } from "../global/config";

// import routes
import { router as mainRouter } from "./routes/main";
import { router as replaysRouter } from "./routes/replays";

const app = express();

export function startServer() {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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

  app.listen(Config.REPLAY_SERVER_PORT, Config.REPLAY_SERVER_HOST, async () => {
    console.log(`Replay Server is ready to serve!`);
    console.log(`Listening on ${Config.REPLAY_SERVER_HOST}:${Config.REPLAY_SERVER_PORT}`);
  });
}

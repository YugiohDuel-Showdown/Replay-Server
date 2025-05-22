import { Router } from "express";
import replay, { IReplay } from "../../database/models/replay";
const router = Router();

router
  .route("/")
  .get(async (req, res) => {
		const replays = await replay.find<IReplay>();
		console.log(replays);
    return res.status(200).render("index.pug", {
			replays
		});
  });

export { router };

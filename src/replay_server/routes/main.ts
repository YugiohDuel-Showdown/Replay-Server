import { Router } from "express";
import replay, { IReplay } from "../../database/models/replay";
import { logError, logInfo } from "../../global/logger";
const router = Router();

router
  .route("/")
  .get(async (req, res) => {
		try {
			logInfo("Rendering replay index.");
			const replays = await replay.find<IReplay>();
			logInfo("Loaded replays for index.", { count: replays.length });
			return res.status(200).render("index.pug", {
				replays
			});
		} catch (error) {
			logError("Failed to render replay index.", error);
			res.status(500).send("failed to load replay index");
		}
  });

export { router };

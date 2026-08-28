import { Router } from "express";
import Replay, { IReplay } from "../../database/models/replay";
import axios from "axios";
import { logError, logInfo } from "../../global/logger";

export const router = Router();

router.route("/:id").post(async (req, res) => {
	logInfo("Replay upload request received.", {
		routeId: req.params.id,
		bodyId: req.body.id,
	});

	// validation
	if (!req.body.id) {
		logInfo("Replay upload missing id.");
		res
			.status(400)
			.send("The requested replay that was recieved did not contain an id!");
		return;
	}
	if (!req.body.log) {
		logInfo("Replay upload missing log.", { replayId: req.body.id });
		res
			.status(400)
			.send(`The requested replay (${req.body.id}) is missing the log data!`);
		return;
	}
	if (!req.body.players) {
		logInfo("Replay upload missing players.", { replayId: req.body.id });
		res
			.status(400)
			.send(
				`The requested replay (${req.body.id}) is missing the players data!`
			);
		return;
	}
	if (!req.body.format) {
		logInfo("Replay upload missing format.", { replayId: req.body.id });
		res
			.status(400)
			.send(
				`The requested replay (${req.body.id}) is missing the format data!`
			);
		return;
	}
	if (!req.body.rating) req.body.rating = 0;

	try {
		// Saves the replay.
		const newReplay = new Replay({
			id: req.body.id,
			log: req.body.log,
			players: req.body.players,
			format: req.body.format,
			rating: req.body.rating,
			private: req.body.private,
			password: req.body.password,
			inputlog: req.body.inputlog,
			uploadtime: req.body.uploadtime,
		});
		await newReplay.save();
		logInfo("Replay saved.", { replayId: req.body.id });

		await axios.post('http://40.160.235.137:3000/replay', {
			replay_id: req.body.id,
		});
		logInfo("Replay webhook sent.", { replayId: req.body.id });

		res.status(200).send("Replay has been saved!");
	} catch (error) {
		logError("Failed to save replay.", error, { replayId: req.body.id });
		res.status(500).send("failed to save replay");
	}
}).get(async (req, res) => {
	try {
		logInfo("Rendering replay detail.", { replayId: req.params.id });
		const replay = await Replay.findOne<IReplay>({
			id: req.params.id
		});

		if (!replay) {
			logInfo("Replay not found.", { replayId: req.params.id });
			res.status(404)
				.send(`That replay doesn't seem to exists!`);
				return;
		}

		return res.status(200).render('replay.pug', {
			replay
		});
	} catch (error) {
		logError("Failed to render replay detail.", error, { replayId: req.params.id });
		res.status(500).send("failed to load replay");
	}
});

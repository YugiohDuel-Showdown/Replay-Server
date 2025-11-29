import { Router } from "express";
import Replay, { IReplay } from "../../database/models/replay";
import axios from "axios";

export const router = Router();

router.route("/:id").post(async (req, res) => {

	// validation
	if (!req.body.id) {
		console.log("Doesn't Have an id.");
		res
			.status(400)
			.send("The requested replay that was recieved did not contain an id!");
		return;
	}
	if (!req.body.log) {
		console.log("Doesn't have a log");
		res
			.status(400)
			.send(`The requested replay (${req.body.id}) is missing the log data!`);
		return;
	}
	if (!req.body.players) {
		console.log("Doesn't have a players");
		res
			.status(400)
			.send(
				`The requested replay (${req.body.id}) is missing the players data!`
			);
		return;
	}
	if (!req.body.format) {
		console.log("Doesn't have a format");
		res
			.status(400)
			.send(
				`The requested replay (${req.body.id}) is missing the format data!`
			);
		return;
	}
	if (!req.body.rating) req.body.rating = 0;

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

	await axios.post('http://40.160.235.137:3000/replay', {
		replay_id: req.body.id,
	});

	res.status(200).send("Replay has been saved!");
}).get(async (req, res) => {
	const replay = await Replay.findOne<IReplay>({
		id: req.params.id
	});

	if (!replay) {
		res.status(404)
			.send(`That replay doesn't seem to exists!`);
			return;
	}

	return res.status(200).render('replay.pug', {
		replay
	});
});
import mongoose from 'mongoose';
import { Config} from './global/config';
require("dotenv").config();
import { startServer } from "./replay_server/server";

async function main() {
	const mongoUri = Config.MONGODB_CONNECT_URL;

	if (!mongoUri) {
		throw new Error("MONGODB_CONNECT_URI is required.");
	}

	await mongoose.connect(mongoUri, {
		family: Config.MONGODB_CONNECT_FAMILY,
		serverSelectionTimeoutMS: Config.MONGODB_SERVER_SELECTION_TIMEOUT_MS,
	});

	startServer();
}

main().catch((error) => {
	console.error("Failed to start replay server:", error);
	process.exit(1);
});

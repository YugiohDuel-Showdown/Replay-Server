import mongoose from 'mongoose';
import { Config} from './global/config';
require("dotenv").config();
import { startServer } from "./replay_server/server";

async function connectMongoWithRetry() {
	const mongoUri = Config.MONGODB_CONNECT_URL;

	if (!mongoUri) {
		console.error("MONGODB_CONNECT_URI is required. MongoDB connection will not be available.");
		return;
	}

	try {
		await mongoose.connect(mongoUri, {
			family: Config.MONGODB_CONNECT_FAMILY,
			serverSelectionTimeoutMS: Config.MONGODB_SERVER_SELECTION_TIMEOUT_MS,
		});
		console.log("Connected to MongoDB.");
	} catch (error) {
		console.error("MongoDB connection failed. Retrying soon:", error);
		setTimeout(connectMongoWithRetry, Config.MONGODB_RETRY_INTERVAL_MS);
	}
}

async function main() {
	startServer();
	connectMongoWithRetry();
}

main().catch((error) => {
	console.error("Failed to start replay server:", error);
	process.exit(1);
});

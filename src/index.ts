import mongoose from 'mongoose';
import { Config} from './global/config';
require("dotenv").config();
import { startServer } from "./replay_server/server";
import { logError, logInfo } from "./global/logger";

mongoose.connection.on("connecting", () => logInfo("MongoDB connecting."));
mongoose.connection.on("connected", () => logInfo("MongoDB connected."));
mongoose.connection.on("disconnected", () => logInfo("MongoDB disconnected."));
mongoose.connection.on("reconnected", () => logInfo("MongoDB reconnected."));
mongoose.connection.on("error", (error) => logError("MongoDB connection error.", error));

async function connectMongoWithRetry() {
	const mongoUri = Config.MONGODB_CONNECT_URL;

	if (!mongoUri) {
		logError("MONGODB_CONNECT_URI is required. MongoDB connection will not be available.");
		return;
	}

	try {
		logInfo("Attempting MongoDB connection.", {
			family: Config.MONGODB_CONNECT_FAMILY,
			serverSelectionTimeoutMS: Config.MONGODB_SERVER_SELECTION_TIMEOUT_MS,
		});
		await mongoose.connect(mongoUri, {
			family: Config.MONGODB_CONNECT_FAMILY,
			serverSelectionTimeoutMS: Config.MONGODB_SERVER_SELECTION_TIMEOUT_MS,
		});
		logInfo("Connected to MongoDB.");
	} catch (error) {
		logError("MongoDB connection failed. Retrying soon.", error, {
			retryIntervalMS: Config.MONGODB_RETRY_INTERVAL_MS,
		});
		setTimeout(connectMongoWithRetry, Config.MONGODB_RETRY_INTERVAL_MS);
	}
}

async function main() {
	startServer();
	connectMongoWithRetry();
}

main().catch((error) => {
	logError("Failed to start replay server.", error);
	process.exit(1);
});

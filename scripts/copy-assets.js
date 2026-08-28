const fs = require("fs");
const path = require("path");

const source = path.join(__dirname, "..", "src", "replay_server", "views");
const destination = path.join(__dirname, "..", "dist", "replay_server", "views");

fs.rmSync(destination, { recursive: true, force: true });
fs.cpSync(source, destination, { recursive: true });

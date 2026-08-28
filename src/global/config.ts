export class Config {
  public static get MONGODB_CONNECT_URL () { return process.env.MONGODB_CONNECT_URI; }
  public static get MONGODB_CONNECT_FAMILY() { return Number(process.env.MONGODB_CONNECT_FAMILY || 4); }
  public static get MONGODB_SERVER_SELECTION_TIMEOUT_MS() { return Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || 10000); }
  public static get REPLAY_SERVER_PORT() { return process.env.REPLAY_SERVER_PORT || 8080; }
  public static get REPLAY_SERVER_URL() { return process.env.REPLAY_SERVER_URL || "https://replay.yugiohduel.net"}
}

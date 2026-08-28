# Replay Server

Express and TypeScript replay server backed by MongoDB.

## Environment

Set these variables in Coolify:

- `MONGODB_CONNECT_URI`: MongoDB connection string.
- `MONGODB_CONNECT_FAMILY`: DNS address family for MongoDB connections. Defaults to `4`.
- `MONGODB_SERVER_SELECTION_TIMEOUT_MS`: MongoDB startup timeout. Defaults to `10000`.
- `MONGODB_RETRY_INTERVAL_MS`: MongoDB retry interval. Defaults to `30000`.
- `REPLAY_SERVER_HOST`: Bind address. Use `0.0.0.0` in Docker/Coolify.
- `REPLAY_SERVER_PORT`: Internal app port. Use `3000` unless you also change the Dockerfile.
- `REPLAY_SERVER_URL`: Public URL used by the app.

## Local Commands

```bash
npm install
npm run build
npm start
```

## Coolify

Create a new application from this repository and choose the Dockerfile build pack. The container exposes port `3000`; set the application port in Coolify to `3000`.

If MongoDB is also managed by Coolify, create a MongoDB resource and use its internal connection string for `MONGODB_CONNECT_URI`.

For MongoDB Atlas, use the full application connection string, including the database name and query parameters, for example:

```text
mongodb+srv://user:password@cluster.example.mongodb.net/replay-server?retryWrites=true&w=majority
```

Also make sure the Coolify server's outbound IP is allowed in the Atlas Network Access list.

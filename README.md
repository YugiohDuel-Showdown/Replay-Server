# Replay Server

Express and TypeScript replay server backed by MongoDB.

## Environment

Set these variables in Coolify:

- `MONGODB_CONNECT_URI`: MongoDB connection string.
- `REPLAY_SERVER_PORT`: Internal app port. Use `8080` unless you also change the Dockerfile.
- `REPLAY_SERVER_URL`: Public URL used by the app.

## Local Commands

```bash
npm install
npm run build
npm start
```

## Coolify

Create a new application from this repository and choose the Dockerfile build pack. The container exposes port `8080`; set the application port in Coolify to `8080`.

If MongoDB is also managed by Coolify, create a MongoDB resource and use its internal connection string for `MONGODB_CONNECT_URI`.

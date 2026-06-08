# HireTrack — Backend

Express + MongoDB API for HireTrack.

## Prerequisites
- Node.js 18+ (or compatible LTS)
- MongoDB instance (local or Atlas)

## Setup
1. Copy `.env.example` to `.env` and fill values (or create `.env`):

```
MONGO_URI=mongodb://localhost:27017/hiretrack
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:5173
PORT=3001
```

2. Install dependencies and start the server:

```bash
cd Backend
npm install
npm run dev
```

- `npm run dev` uses `nodemon` (if configured) for automatic reloads.
- The API root will respond at `http://localhost:3001/` by default.

## Available routes (overview)
- `POST /auth/signup` — create account
- `POST /auth/signin` — login
- `GET /applications` — protected: list applications
- `POST /applications` — protected: create application
- ... see `Backend/routes/*.js` for full details

## Environment variables
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret used to sign authentication tokens
- `CLIENT_URL` — allowed frontend origin for CORS
- `PORT` — server port (default 3001)

## Notes
- CORS is enabled using `CLIENT_URL` or `*` if not set.
- Keep `.env` out of source control.

If you want, I can add a `POST /auth/signup` test script or a seed script to create a demo user.

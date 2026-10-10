# Quote with Ease

Quote with Ease is a web-based personal quote collection. It stores quotes,
book references, tags, author images, and display preferences in a MongoDB
database, with a React/Vite frontend and an Express API.

## Features

- Create, edit, delete, search, and filter quotes.
- Store book, book number, part, chapter, section, and page references.
- Add tags using existing and suggested tags.
- Look up an author image from Wikipedia, paste an image URL, or choose a
  local image.
- Customize quote font color.
- Read quotes in a full-screen reading view.
- Save a quote as a vertical image or share it through the browser share sheet.

## Project structure

```text
frontend/   React + Vite web application
backend/    Express + Mongoose API
docker-compose.yml  Local MongoDB service
```

## Requirements

- Node.js 20 or newer
- npm
- Docker Desktop for local MongoDB, or a MongoDB Atlas database

## Run locally

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Start MongoDB

The easiest local option is Docker:

```bash
docker compose up -d mongodb
```

If Docker is not running, the backend cannot start and the frontend will show:
`Cannot connect to the quote server. Start the backend and try again.`

### 3. Configure the backend

Create `backend/.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/quote-with-ease
PORT=3000
```

### 4. Start the API

```bash
cd backend
npm run dev
```

The API will be available at <http://localhost:3000>.

Check it with:

```bash
curl http://localhost:3000/api/health
```

### 5. Start the frontend

In a second terminal:

```bash
cd frontend
npm run dev
```

Open the URL printed by Vite, normally
<http://localhost:5173/>.

The frontend defaults to `http://localhost:3000` for the API. To use another
API URL, create `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:3000
```

## Permanent web storage

The local Docker database persists in a Docker volume, but it only exists on
your computer. For permanent storage accessible from a deployed website, use
MongoDB Atlas:

1. Create a free MongoDB Atlas cluster.
2. Create a database user.
3. Allow your deployed backend to connect in Atlas Network Access.
4. Copy the Atlas connection string.
5. Set `MONGODB_URI` in the backend hosting platform.
6. Deploy the backend and set the frontend's `VITE_API_URL` to its public URL.

Do not put `MONGODB_URI` in frontend code or commit it to GitHub. The frontend
only needs the public API URL.

## Production deployment

The frontend and backend are separate applications:

- Deploy `frontend/` to Vercel, Netlify, or another static hosting platform.
- Deploy `backend/` to Render, Railway, Fly.io, or another Node.js host.
- Use MongoDB Atlas for the production database.
- Configure CORS on the backend for the deployed frontend origin if the host
  requires a restricted origin.

GitHub stores the source code; it does not automatically run the Express API
or provide MongoDB storage. A live website requires hosting for the frontend,
backend, and database.

## Useful commands

Frontend:

```bash
cd frontend
npm run dev
npm run lint
npm run build
```

Backend:

```bash
cd backend
npm run dev
npm start
```

## API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/health` | Check API availability |
| GET | `/api/quotes` | List quotes |
| POST | `/api/quotes` | Create a quote |
| PUT | `/api/quotes/:id` | Update a quote |
| DELETE | `/api/quotes/:id` | Delete a quote |

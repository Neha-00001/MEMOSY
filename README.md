# 📝 Memosy — AI-Powered Notes App

A full-stack MERN notes application with built-in AI features: spelling correction, note summarization, and automatic title generation.

**Live demo:**https://memosy-da8f.vercel.app/ https://memosy.vercel.app/ &nbsp;
---

## Features

- ✏️ Create, read, update, and delete notes
- 🤖 **AI Fix Spelling** — corrects grammar/spelling in note content on demand
- 📄 **AI Summarize** — generates a short summary of longer notes
- ✨ **Auto Title Generation** — suggests a title based on content if you leave it blank
- 🔎 Search notes by title or content (backend-ready)
- 🛡️ Rate limiting via Upstash Redis (100 requests / 60s)
- 📱 Responsive design, mobile-friendly

---

## Tech Stack

**Frontend**
- React + Vite
- Tailwind CSS
- React Router
- Axios
- react-hot-toast (notifications)
- lucide-react (icons)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- Upstash Redis (rate limiting)
- Google Gemini API (AI features)

**Deployment**
- Both frontend and backend deployed on Vercel

---

## Project Structure

```
memosy/
├── BackEND/
│   ├── src/
│   │   ├── config/          # DB and rate-limiter setup
│   │   ├── controllers/     # Notes and AI request handlers
│   │   ├── middlewares/     # Rate limiter middleware
│   │   ├── models/          # Mongoose Note schema
│   │   ├── routes/          # /api/notes and /api/ai routes
│   │   └── server.js        # App entry point
│   ├── api/                 # Vercel serverless entry
│   └── vercel.json
│
└── FrontEND/
    ├── src/
    │   ├── components/      # Navbar, NoteCard
    │   ├── pages/           # HomePage, CreatePage, NoteDetail
    │   ├── lib/              # Axios instance, AI API helpers
    │   └── App.jsx
    └── vite.config.js
```

---

## API Endpoints

| Method | Endpoint                  | Description                    |
|--------|----------------------------|---------------------------------|
| GET    | `/api/notes`               | Get all notes                  |
| GET    | `/api/notes/:id`           | Get a single note              |
| POST   | `/api/notes`                | Create a new note              |
| PUT    | `/api/notes/:id`           | Update a note                  |
| DELETE | `/api/notes/:id`           | Delete a note                  |
| GET    | `/api/notes/search?q=`     | Search notes by title/content  |
| GET    | `/api/notes/stats`         | Get total note count           |
| POST   | `/api/ai/fix-spelling`     | Fix spelling/grammar in text   |
| POST   | `/api/ai/summarize`        | Summarize note content         |
| POST   | `/api/ai/generate-title`   | Generate a title from content  |

---

## Running Locally

### Prerequisites
- Node.js 18+
- A MongoDB Atlas connection string
- An Upstash Redis database
- A free Gemini API key ([Google AI Studio](https://aistudio.google.com))

### Backend

```bash
cd BackEND
npm install
```

Create a `.env` file in `BackEND/`:

```env
MONGO_URL=your_mongodb_connection_string
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
GEMINI_API_KEY=your_gemini_api_key
```

```bash
npm run dev
```

Runs on `http://localhost:8080`.

### Frontend

```bash
cd FrontEND
npm install
npm run dev
```

Runs on `http://localhost:5173`.

---

## Deployment Notes

Both apps are deployed on (https://vercel.com). The backend runs as a Vercel serverless function (see `BackEND/api/index.js` and `vercel.json`). Since MongoDB Atlas doesn't allow static IP whitelisting for serverless platforms, Network Access is set to allow all IPs (`0.0.0.0/0`) — this makes the database password the primary line of defense, so it's kept out of version control via `.gitignore`.

---

## License

This project is licensed under the MIT License — see the (LICENSE) file for details.

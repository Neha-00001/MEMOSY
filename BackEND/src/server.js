// import dotenv from "dotenv";
// dotenv.config();
// import express from "express";
// import cors from "cors";
// import notesroute from "./routes/notesroute.js";
// import airoute from "./routes/ai.routes.js";
// import { connectDB } from "./config/db.js";
// import rateLimiter from "./middlewares/rateLimiter.js";

// const app = express();
// const port = process.env.PORT || 8080;

// app.use(cors()); // allows the frontend (running on a different port) to call this API
// app.use(express.json());
// app.use(rateLimiter);

// app.use("/api/notes", notesroute);
// app.use("/api/ai", airoute);

// app.get("/", (req, res) => {
//   res.send("Notes API is running.");
// });

// // 404 for unknown routes
// app.use((req, res) => {
//   res.status(404).json({ message: "Route not found" });
// });

// // Centralized error handler (catches anything passed to next(error))
// app.use((err, req, res, next) => {
//   console.error("Unhandled error:", err);
//   res.status(500).json({ message: "Internal server error" });
// });

// connectDB().then(() => {
//   app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
//   });
// });



import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import notesroute from "./routes/notesroute.js";
import airoute from "./routes/ai.routes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middlewares/rateLimiter.js";

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(rateLimiter);

app.use("/api/notes", notesroute);
app.use("/api/ai", airoute);

app.get("/", (req, res) => {
  res.send("Notes API is running.");
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

connectDB();

// Only bind to a port when running locally — on Vercel, the exported
// app itself is used directly as the serverless function handler.
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
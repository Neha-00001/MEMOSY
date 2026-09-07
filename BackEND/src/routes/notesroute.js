import express from "express";
import {
  getAllNotes,
  createANote,
  UpdateANote,
  DeleteANote,
  getNoteById,
  searchNotes,
  getNotesStats,
} from "../controllers/notescontroller.js";

const router = express.Router();

// Specific routes must come before "/:id" so "search"/"stats" aren't
// mistaken for a note id.
router.get("/search", searchNotes);
router.get("/stats", getNotesStats);

router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.post("/", createANote);
router.put("/:id", UpdateANote);
router.delete("/:id", DeleteANote);

export default router;

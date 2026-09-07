import Note from "../models/Note.js";

// GET /api/notes
export async function getAllNotes(_, res) {
  try {
    const notes = await Note.find().sort({ createdAt: -1 }); // fixed typo: was "createAt"
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getAllNotes controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// GET /api/notes/search?q=...
export async function searchNotes(req, res) {
  try {
    const { q } = req.query;

    if (!q?.trim()) {
      return res.status(400).json({ message: "Search query 'q' is required" });
    }

    const regex = new RegExp(q.trim(), "i"); // case-insensitive
    const notes = await Note.find({
      $or: [{ title: regex }, { content: regex }],
    }).sort({ createdAt: -1 });

    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in searchNotes controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// GET /api/notes/stats
export async function getNotesStats(_, res) {
  try {
    const totalNotes = await Note.countDocuments();
    const lastNote = await Note.findOne().sort({ createdAt: -1 });

    res.status(200).json({
      totalNotes,
      lastUpdated: lastNote?.updatedAt ?? null,
    });
  } catch (error) {
    console.error("Error in getNotesStats controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// GET /api/notes/:id
export async function getNoteById(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not Found" });
    res.status(200).json(note);
  } catch (error) {
    console.error("Error in getting a Note of this id", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// POST /api/notes
export async function createANote(req, res) {
  try {
    const { title, content } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const note = new Note({ title, content });
    const savedNote = await note.save();
    // returns the note directly (was previously wrapped as { savednote }),
    // to stay consistent with the other endpoints
    res.status(201).json(savedNote);
  } catch (error) {
    console.error("Error in CreateNotes controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// PUT /api/notes/:id
export async function UpdateANote(req, res) {
  try {
    const { title, content } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true, runValidators: true }
    );

    if (!updatedNote) return res.status(404).json({ message: "Note not Found" });
    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error in UpdateNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// DELETE /api/notes/:id
export async function DeleteANote(req, res) {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) return res.status(404).json({ message: "Note not Found" });
    res.status(200).json(deletedNote);
  } catch (error) {
    console.error("Error in deleteNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { NotebookPen, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../lib/axios";
import NoteCard from "../components/NoteCard";

const HomePage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        setNotes(res.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
        toast.error("Failed to load notes. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleDelete = async (e, id) => {
    e.preventDefault(); // don't navigate to the note when clicking delete
    if (!window.confirm("Delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note._id !== id));
      toast.success("Note deleted");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
        </div>
      ) : notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20">
          <NotebookPen className="w-12 h-12 text-slate-300 mb-4" />
          <h2 className="text-lg font-semibold text-slate-700">
            No notes yet
          </h2>
          <p className="text-slate-500 mt-1 mb-6">
            Create your first note to get started.
          </p>
          <Link
            to="/create"
            className="bg-pink-500 hover:bg-pink-600 transition-colors text-white text-sm font-medium px-5 py-2.5 rounded-lg"
          >
            Create a note
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {notes.map((note) => (
            <NoteCard key={note._id} note={note} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Loader2,
  Trash2,
  Save,
  Wand2,
  FileText,
  Sparkles,
  X,
} from "lucide-react";
import api from "../lib/axios";
import { fixSpelling, summarizeNote } from "../lib/aiApi";

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fixingSpelling, setFixingSpelling] = useState(false);
  const [summarizing, setSummarizing] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setTitle(res.data.title);
        setContent(res.data.content);
      } catch (error) {
        console.error("Error fetching note:", error);
        toast.error("Note not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, navigate]);

  const handleFixSpelling = async () => {
    if (!content.trim()) {
      toast.error("Write some content first");
      return;
    }
    setFixingSpelling(true);
    try {
      const corrected = await fixSpelling(content);
      setContent(corrected);
      toast.success("Spelling fixed");
    } catch (error) {
      console.error("Error fixing spelling:", error);
      toast.error("Couldn't fix spelling right now");
    } finally {
      setFixingSpelling(false);
    }
  };

  const handleSummarize = async () => {
    if (!content.trim()) {
      toast.error("Write some content first");
      return;
    }
    setSummarizing(true);
    try {
      const result = await summarizeNote(content);
      setSummary(result);
    } catch (error) {
      console.error("Error summarizing note:", error);
      toast.error("Couldn't summarize right now");
    } finally {
      setSummarizing(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in both title and content");
      return;
    }

    setSaving(true);
    try {
      await api.put(`/notes/${id}`, { title, content });
      toast.success("Note updated");
      navigate("/");
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this note? This can't be undone.")) return;

    setDeleting(true);
    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted");
      navigate("/");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to notes
        </Link>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 disabled:opacity-60"
        >
          {deleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
          Delete
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h1 className="text-xl font-semibold text-slate-800 mb-6">
          Edit Note
        </h1>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="content" className="block text-sm font-medium text-slate-700">
                Content
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleFixSpelling}
                  disabled={fixingSpelling}
                  className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-pink-600 disabled:opacity-60"
                >
                  {fixingSpelling ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Wand2 className="w-3.5 h-3.5" />
                  )}
                  Fix Spelling
                </button>
                <button
                  type="button"
                  onClick={handleSummarize}
                  disabled={summarizing}
                  className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-pink-600 disabled:opacity-60"
                >
                  {summarizing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <FileText className="w-3.5 h-3.5" />
                  )}
                  Summarize
                </button>
              </div>
            </div>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
            />
          </div>

          {summary && (
            <div className="flex items-start gap-2 bg-pink-50 border border-pink-100 rounded-lg p-3 text-sm text-slate-700">
              <Sparkles className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
              <p className="flex-1">{summary}</p>
              <button
                type="button"
                onClick={() => setSummary("")}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Dismiss summary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-white text-sm font-medium px-5 py-2.5 rounded-lg"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteDetail;

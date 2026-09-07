import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2, Wand2, FileText, Sparkles, X } from "lucide-react";
import api from "../lib/axios";
import { fixSpelling, summarizeNote, generateTitle } from "../lib/aiApi";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [saving, setSaving] = useState(false);
  const [fixingSpelling, setFixingSpelling] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [generatingTitle, setGeneratingTitle] = useState(false);
  const [titleTouched, setTitleTouched] = useState(false);
  const navigate = useNavigate();

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

  // Auto-suggest a title once the user finishes writing content,
  // but only if they haven't typed a title themselves.
  const handleContentBlur = async () => {
    if (titleTouched || title.trim() || !content.trim()) return;

    setGeneratingTitle(true);
    try {
      const suggested = await generateTitle(content);
      setTitle(suggested);
    } catch (error) {
      console.error("Error generating title:", error);
      // Silent failure here — auto-title is a nice-to-have, not critical.
    } finally {
      setGeneratingTitle(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalTitle = title;

    if (!finalTitle.trim() && content.trim()) {
      try {
        finalTitle = await generateTitle(content);
        setTitle(finalTitle);
      } catch (error) {
        console.error("Error generating title on submit:", error);
      }
    }

    if (!finalTitle.trim() || !content.trim()) {
      toast.error("Please fill in both title and content");
      return;
    }

    setSaving(true);
    try {
      await api.post("/notes", { title: finalTitle, content });
      toast.success("Note created");
      navigate("/");
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Failed to create note");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to notes
      </Link>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h1 className="text-xl font-semibold text-slate-800 mb-6">
          Create New Note
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                Title
              </label>
              {generatingTitle && (
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Suggesting a title...
                </span>
              )}
            </div>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setTitleTouched(true);
              }}
              placeholder="Note title... (or leave blank, we'll suggest one)"
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
              onBlur={handleContentBlur}
              placeholder="Write your note here..."
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
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? "Creating..." : "Create Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePage;

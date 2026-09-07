import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

const formatDate = (isoString) => {
  return new Date(isoString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const NoteCard = ({ note, onDelete }) => {
  return (
    <Link
      to={`/note/${note._id}`}
      className="group block bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-slate-800 line-clamp-1">
          {note.title}
        </h3>
        <button
          onClick={(e) => onDelete(e, note._id)}
          className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Delete note"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <p className="text-sm text-slate-500 mt-2 line-clamp-3">
        {note.content}
      </p>
      <p className="text-xs text-slate-400 mt-4">
        {formatDate(note.updatedAt)}
      </p>
    </Link>
  );
};

export default NoteCard;

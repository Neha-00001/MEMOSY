import { Link } from "react-router-dom";
import { NotebookPen, Plus } from "lucide-react";

const Navbar = () => {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-slate-800">
          <NotebookPen className="w-6 h-6 text-pink-500" />
          <span className="text-lg font-semibold tracking-tight">Notes</span>
        </Link>

        <Link
          to="/create"
          className="flex items-center gap-1.5 bg-pink-500 hover:bg-pink-600 transition-colors text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          <Plus className="w-4 h-4" />
          New Note
        </Link>
      </div>
    </header>
  );
};

export default Navbar;

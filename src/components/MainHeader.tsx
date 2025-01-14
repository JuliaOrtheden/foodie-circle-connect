import { Search, Menu } from "lucide-react";
import { Link } from "react-router-dom";

export function MainHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-[#FFC107] p-4 flex justify-between items-center z-50">
      <h1 className="text-2xl font-bold">TasteBud</h1>
      <div className="flex items-center gap-4">
        <Link to="/search">
          <Search className="h-6 w-6" />
        </Link>
        <Menu className="h-6 w-6" />
      </div>
    </header>
  );
}
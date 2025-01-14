import { Home, MapPin, Clock, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function BottomNav() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4">
      <div className="flex justify-around items-center">
        <Link to="/" className={`flex flex-col items-center ${isActive('/') ? 'text-primary' : 'text-gray-500'}`}>
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Feed</span>
        </Link>
        <Link to="/search" className={`flex flex-col items-center ${isActive('/search') ? 'text-primary' : 'text-gray-500'}`}>
          <MapPin className="h-6 w-6" />
          <span className="text-xs mt-1">Explore</span>
        </Link>
        <Link to="/timeline" className={`flex flex-col items-center ${isActive('/timeline') ? 'text-primary' : 'text-gray-500'}`}>
          <Clock className="h-6 w-6" />
          <span className="text-xs mt-1">Timeline</span>
        </Link>
        <Link to="/profile" className={`flex flex-col items-center ${isActive('/profile') ? 'text-primary' : 'text-gray-500'}`}>
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
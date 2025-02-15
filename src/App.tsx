import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Restaurant from "./pages/Restaurant";
import Timeline from "./pages/Timeline";
import Profile from "./pages/Profile";
import { Toaster } from "./components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { DishForm } from "./components/DishForm";
import { BottomNav } from "./components/BottomNav";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="pb-16"> {/* Add padding to prevent content from being hidden behind the nav */}
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/search" element={<Search />} />
              <Route path="/restaurant/:name" element={<Restaurant />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/log-dish" element={<div className="p-4 max-w-2xl mx-auto"><DishForm /></div>} />
            </Routes>
          </div>
          <BottomNav />
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
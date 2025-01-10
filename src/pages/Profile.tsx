import { useAuth } from "@/contexts/AuthContext";
import { SubscriptionManager } from "@/components/SubscriptionManager";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock, Search } from "lucide-react";
import { LoginButton } from "@/components/LoginButton";

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary to-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Please sign in to view your profile</h2>
            <LoginButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-12">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Profile</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link to="/search" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/timeline" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                View Timeline
              </Link>
            </Button>
            <LoginButton />
          </div>
        </header>

        <div className="max-w-3xl mx-auto">
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Your Subscriptions</h2>
            <SubscriptionManager />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
import { PopularDishes } from "@/components/PopularDishes";
import { FriendsFeed } from "@/components/FriendsFeed";
import { LoginButton } from "@/components/LoginButton";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary to-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-12">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">FoodieCircle</h1>
            <p className="text-lg text-gray-600">Discover and share amazing dishes</p>
          </div>
          <LoginButton />
        </header>
        
        <main>
          {user ? (
            <>
              <PopularDishes />
              <FriendsFeed />
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">Sign in to start sharing your culinary adventures</h2>
              <p className="text-gray-600 mb-8">Join our community of food enthusiasts</p>
              <LoginButton />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
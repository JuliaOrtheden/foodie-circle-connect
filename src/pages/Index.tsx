import { PopularDishes } from "@/components/PopularDishes";
import { FriendsFeed } from "@/components/FriendsFeed";
import { useAuth } from "@/contexts/AuthContext";
import { MainHeader } from "@/components/MainHeader";
import { CreatePostPrompt } from "@/components/CreatePostPrompt";
import { LoginButton } from "@/components/LoginButton";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />
      
      <main className="pt-16 pb-20 px-4">
        {!user ? (
          <div className="max-w-md mx-auto mt-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to TasteBud</h1>
            <p className="text-gray-600 mb-8">Join our community of food enthusiasts and start sharing your culinary adventures</p>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <LoginButton />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <CreatePostPrompt />
            <FriendsFeed />
            <PopularDishes />
          </div>
        )}
      </main>
    </div>
  );
}

export default Index;
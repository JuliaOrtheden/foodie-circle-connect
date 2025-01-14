import { PopularDishes } from "@/components/PopularDishes";
import { FriendsFeed } from "@/components/FriendsFeed";
import { useAuth } from "@/contexts/AuthContext";
import { DishForm } from "@/components/DishForm";
import { MainHeader } from "@/components/MainHeader";
import { BottomNav } from "@/components/BottomNav";
import { CreatePostPrompt } from "@/components/CreatePostPrompt";

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
        <CreatePostPrompt />
        
        {user ? (
          <div className="space-y-6 mt-6">
            <FriendsFeed />
            <PopularDishes />
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Sign in to start sharing your culinary adventures</h2>
            <p className="text-gray-600 mb-8">Join our community of food enthusiasts</p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

export default Index;
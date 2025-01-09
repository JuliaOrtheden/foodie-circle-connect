import { PopularDishes } from "@/components/PopularDishes";
import { FriendsFeed } from "@/components/FriendsFeed";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">FoodieCircle</h1>
          <p className="text-lg text-gray-600">Discover and share amazing dishes</p>
        </header>
        
        <main>
          <PopularDishes />
          <FriendsFeed />
        </main>
      </div>
    </div>
  );
};

export default Index;
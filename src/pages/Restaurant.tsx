import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DishCard } from "@/components/DishCard";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Restaurant = () => {
  const { restaurantName } = useParams();
  const { user } = useAuth();

  const { data: dishes } = useQuery({
    queryKey: ["restaurant-dishes", restaurantName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dishes")
        .select("*")
        .eq("restaurant", restaurantName);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: subscription, refetch: refetchSubscription } = useQuery({
    queryKey: ["restaurant-subscription", restaurantName, user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("subscribed_to_restaurant", restaurantName)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  // Calculate mean atmosphere rating and get atmosphere categories
  const atmosphereStats = dishes?.reduce((acc, dish) => {
    if (dish.atmosphere) {
      acc.totalRating += parseInt(dish.atmosphere);
      acc.count += 1;
    }
    if (dish.place && !acc.categories[dish.place]) {
      acc.categories[dish.place] = 1;
    } else if (dish.place) {
      acc.categories[dish.place] += 1;
    }
    return acc;
  }, { totalRating: 0, count: 0, categories: {} as Record<string, number> });

  const meanAtmosphere = atmosphereStats?.count ? 
    (atmosphereStats.totalRating / atmosphereStats.count).toFixed(1) : 
    null;

  const mostCommonCategory = atmosphereStats?.categories ? 
    Object.entries(atmosphereStats.categories).sort((a, b) => b[1] - a[1])[0]?.[0] : 
    null;

  const getCategoryEmoji = (category: string) => {
    const categories: Record<string, string> = {
      'date': '💑',
      'after work': '🍺',
      'business dinner': '💼',
      'going out with friends': '👥',
      'family gatherings': '🏠'
    };
    return categories[category] || '';
  };

  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Please sign in to follow restaurants");
      return;
    }

    try {
      if (subscription) {
        const { error } = await supabase
          .from("subscriptions")
          .delete()
          .eq("id", subscription.id);

        if (error) throw error;
        toast.success(`Unfollowed ${restaurantName}`);
      } else {
        const { error } = await supabase.from("subscriptions").insert({
          user_id: user.id,
          subscribed_to_restaurant: restaurantName,
        });

        if (error) throw error;
        toast.success(`Now following ${restaurantName}`);
      }
      refetchSubscription();
    } catch (error) {
      console.error("Error managing restaurant subscription:", error);
      toast.error("Failed to update subscription. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" asChild>
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{restaurantName}</h1>
          {meanAtmosphere && (
            <div className="flex items-center gap-2 mt-2">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-gray-600">
                Atmosphere: {meanAtmosphere}/5
              </span>
            </div>
          )}
          {mostCommonCategory && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-600">
                Best for: {getCategoryEmoji(mostCommonCategory)} {mostCommonCategory}
              </span>
            </div>
          )}
        </div>
        <Button
          variant="outline"
          onClick={handleSubscribe}
          className="flex items-center gap-2"
        >
          <Heart className={cn("h-4 w-4", subscription ? "fill-primary text-primary" : "text-gray-400")} />
          {subscription ? "Following" : "Follow"}
        </Button>
      </div>

      {dishes && dishes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dishes.map((dish) => (
            <DishCard
              key={dish.id}
              image={dish.image_url || "/placeholder.svg"}
              name={dish.name}
              restaurant={dish.restaurant || ""}
              rating={dish.rating || 0}
              likes={0}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No dishes found for this restaurant.</p>
      )}
    </div>
  );
};

export default Restaurant;
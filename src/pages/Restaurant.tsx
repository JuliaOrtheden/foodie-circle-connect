import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DishCard } from "@/components/DishCard";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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
        <h1 className="text-3xl font-bold">{restaurantName}</h1>
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
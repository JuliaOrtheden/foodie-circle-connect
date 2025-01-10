import { Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface DishCardProps {
  image: string;
  name: string;
  restaurant: string;
  rating: number;
  likes: number;
  className?: string;
}

export function DishCard({ image, name, restaurant, rating, likes, className }: DishCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleRestaurantClick = async (restaurantName: string) => {
    if (!user) {
      toast.error("Please sign in to follow restaurants");
      return;
    }

    try {
      const { error } = await supabase.from("subscriptions").insert({
        user_id: user.id,
        subscribed_to_restaurant: restaurantName,
      });

      if (error) throw error;
      toast.success(`Now following ${restaurantName}`);
    } catch (error) {
      console.error("Error following restaurant:", error);
      toast.error("Failed to follow restaurant. Please try again.");
    }
  };

  return (
    <div className={cn("group relative overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg animate-fade-in", className)}>
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
        <button
          onClick={() => handleRestaurantClick(restaurant)}
          className="text-sm text-primary hover:underline focus:outline-none"
        >
          {restaurant}
        </button>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">{likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
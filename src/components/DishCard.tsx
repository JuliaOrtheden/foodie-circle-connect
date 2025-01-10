import { Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DishCardProps {
  image: string;
  name: string;
  restaurant: string;
  rating: number;
  likes: number;
  atmosphere?: string;
  place?: string;
  className?: string;
}

export function DishCard({ 
  image, 
  name, 
  restaurant, 
  rating, 
  likes, 
  atmosphere,
  place,
  className 
}: DishCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: subscription } = useQuery({
    queryKey: ["restaurant-subscription", restaurant, user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("subscribed_to_restaurant", restaurant)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleRestaurantClick = () => {
    navigate(`/restaurant/${encodeURIComponent(restaurant)}`);
  };

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
        <div className="flex items-center gap-2">
          <button
            onClick={handleRestaurantClick}
            className="text-sm text-primary hover:underline focus:outline-none"
          >
            {restaurant}
          </button>
          {subscription && (
            <Heart className="h-4 w-4 fill-primary text-primary" />
          )}
        </div>
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
        {(atmosphere || place) && (
          <div className="mt-2 flex flex-col gap-1 text-sm text-gray-600">
            {atmosphere && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>Atmosphere: {atmosphere}/5</span>
              </div>
            )}
            {place && (
              <div className="flex items-center gap-1">
                <span>Perfect for: {getCategoryEmoji(place)} {place}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
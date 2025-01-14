import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, MessageCircle, Share2, ThumbsUp, Utensils } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Dish = Database['public']['Tables']['dishes']['Row'];

const Timeline = () => {
  const { user } = useAuth();

  const { data: dishes, isLoading } = useQuery({
    queryKey: ["dishes", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dishes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary to-white flex items-center justify-center">
        <div className="animate-pulse">Loading your dishes...</div>
      </div>
    );
  }

  const uniqueRestaurants = new Set(dishes?.map(dish => dish.restaurant));

  return (
    <div className="container mx-auto px-4 pb-20">
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-4">Your Food Journey</h1>
        <div className="flex gap-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            <span>{dishes?.length || 0} dishes</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{uniqueRestaurants.size} restaurants</span>
          </div>
        </div>
      </div>

      <div className="space-y-8 relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" />

        {dishes?.map((dish, index) => (
          <div key={dish.id} className="relative animate-fade-in">
            {/* Timeline dot */}
            <div className="absolute left-4 w-2 h-2 rounded-full bg-primary transform -translate-x-[5px]" />
            
            <div className="ml-12">
              <time className="text-sm text-muted-foreground">
                {format(new Date(dish.created_at), "MMMM d, yyyy")}
              </time>

              <div className="mt-2 bg-white rounded-lg shadow-sm overflow-hidden">
                {dish.image_url && (
                  <div className="aspect-[16/9] relative overflow-hidden">
                    <img
                      src={dish.image_url}
                      alt={dish.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-4">
                  <h2 className="text-xl font-semibold">{dish.name}</h2>
                  
                  {dish.restaurant && (
                    <div className="flex items-center gap-2 text-muted-foreground mt-2">
                      <MapPin className="h-4 w-4" />
                      <span>{dish.restaurant}</span>
                    </div>
                  )}

                  {dish.rating && (
                    <div className="mt-2 flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span>{dish.rating.toFixed(1)}</span>
                    </div>
                  )}

                  {dish.notes && (
                    <p className="mt-3 text-muted-foreground">{dish.notes}</p>
                  )}

                  <div className="mt-4 flex justify-between border-t pt-4">
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <ThumbsUp className="h-4 w-4" />
                      <span>Like</span>
                    </button>
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span>Comment</span>
                    </button>
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
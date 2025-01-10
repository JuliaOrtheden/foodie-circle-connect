import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { DishCard } from "@/components/DishCard";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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

  const groupDishesByDate = (dishes: Dish[]) => {
    return dishes.reduce((groups: { [key: string]: Dish[] }, dish) => {
      const date = format(new Date(dish.created_at), "MMMM d, yyyy");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(dish);
      return groups;
    }, {});
  };

  const groupedDishes = dishes ? groupDishesByDate(dishes) : {};

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" asChild>
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Your Dish Timeline</h1>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedDishes).map(([date, dishes]) => (
          <div key={date}>
            <h2 className="text-xl font-semibold mb-4">{date}</h2>
            <Separator className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dishes.map((dish: Dish) => (
                <DishCard
                  key={dish.id}
                  image={dish.image_url || "/placeholder.svg"}
                  name={dish.name}
                  restaurant={dish.restaurant || "Unknown Restaurant"}
                  rating={dish.rating || 0}
                  likes={0}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
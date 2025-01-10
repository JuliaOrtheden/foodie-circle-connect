import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Restaurant } from "@/components/search/RestaurantsList";

export const useRestaurantSearch = (query: string, city: string, cuisine: string, atmosphere: string) => {
  return useQuery({
    queryKey: ["search", "restaurants", query, city, cuisine, atmosphere],
    queryFn: async () => {
      let userIdsWithCuisine: string[] = [];
      if (cuisine) {
        const { data: preferencesData } = await supabase
          .from("taste_preferences")
          .select("user_id")
          .contains("favorite_cuisine", [cuisine]);
        
        userIdsWithCuisine = (preferencesData || []).map(p => p.user_id!);
      }

      let queryBuilder = supabase
        .from("dishes")
        .select("restaurant, atmosphere")
        .not("restaurant", "is", null);

      // Add text search filter
      if (query) {
        queryBuilder = queryBuilder.ilike("restaurant", `%${query}%`);
      }

      if (city) {
        queryBuilder = queryBuilder.eq("place", city);
      }

      if (atmosphere) {
        queryBuilder = queryBuilder.eq("atmosphere", atmosphere);
      }

      if (cuisine && userIdsWithCuisine.length > 0) {
        queryBuilder = queryBuilder.in("user_id", userIdsWithCuisine);
      }

      const { data } = await queryBuilder;
      
      // Group by restaurant and calculate average atmosphere rating
      const restaurantMap = new Map<string, { count: number, total: number }>();
      data?.forEach(dish => {
        if (!restaurantMap.has(dish.restaurant!)) {
          restaurantMap.set(dish.restaurant!, { count: 0, total: 0 });
        }
        if (dish.atmosphere) {
          const current = restaurantMap.get(dish.restaurant!)!;
          current.count++;
          current.total += parseFloat(dish.atmosphere);
        }
      });

      const uniqueRestaurants = [...new Set(data?.map(d => d.restaurant))];
      return uniqueRestaurants
        .filter(Boolean)
        .map(restaurant => ({ 
          restaurant: restaurant!,
          atmosphereRating: restaurantMap.get(restaurant!)?.count 
            ? (restaurantMap.get(restaurant!)!.total / restaurantMap.get(restaurant!)!.count).toFixed(1)
            : undefined
        }));
    },
    enabled: true,
  });
};
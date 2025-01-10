import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Restaurant } from "@/components/search/RestaurantsList";

export const useRestaurantSearch = (query: string, city: string, cuisine: string) => {
  return useQuery({
    queryKey: ["search", "restaurants", query, city, cuisine],
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
        .select("restaurant, place")
        .not("restaurant", "is", null);

      if (city) {
        queryBuilder = queryBuilder.eq("place", city);
      }

      if (cuisine && userIdsWithCuisine.length > 0) {
        queryBuilder = queryBuilder.in("user_id", userIdsWithCuisine);
      }

      const { data } = await queryBuilder.limit(20);
      
      const uniqueRestaurants = [...new Set(data?.map(d => d.restaurant))];
      return uniqueRestaurants.map(restaurant => ({ restaurant: restaurant! }));
    },
    enabled: true,
  });
};
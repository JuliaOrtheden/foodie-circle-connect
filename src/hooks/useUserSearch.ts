import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUserSearch = (query: string) => {
  return useQuery({
    queryKey: ["search", "people", query],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .ilike("username", query ? `%${query}%` : '%')
        .limit(20);
      
      if (error) {
        console.error("Error fetching profiles:", error);
        return [];
      }
      
      return data || [];
    },
    enabled: true,
  });
};
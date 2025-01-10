import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { SearchInput } from "@/components/search/SearchInput";
import { UsersList } from "@/components/search/UsersList";
import { RestaurantsList, Restaurant } from "@/components/search/RestaurantsList";
import { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "people";
  const { user } = useAuth();

  const { data: subscriptions } = useQuery({
    queryKey: ["subscriptions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: userResults } = useQuery<Profile[]>({
    queryKey: ["search", "people", query],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .ilike("username", query ? `%${query}%` : '%')
        .limit(20);
      return data || [];
    },
    enabled: category === "people",
  });

  const { data: restaurantResults } = useQuery<Restaurant[]>({
    queryKey: ["search", "restaurants", query],
    queryFn: async () => {
      const { data } = await supabase
        .from("dishes")
        .select("restaurant")
        .ilike("restaurant", query ? `%${query}%` : '%')
        .not("restaurant", "is", null)
        .limit(20);
      
      const uniqueRestaurants = [...new Set(data?.map(d => d.restaurant))];
      return uniqueRestaurants.map(restaurant => ({ restaurant: restaurant! }));
    },
    enabled: category === "restaurants",
  });

  const handleSubscribe = async (restaurantName: string) => {
    if (!user) {
      toast.error("Please sign in to subscribe to restaurants");
      return;
    }

    try {
      const existingSubscription = subscriptions?.find(
        sub => sub.subscribed_to_restaurant === restaurantName
      );

      if (existingSubscription) {
        const { error } = await supabase
          .from("subscriptions")
          .delete()
          .eq("id", existingSubscription.id);

        if (error) throw error;
        toast.success(`Unsubscribed from ${restaurantName}`);
      } else {
        const { error } = await supabase
          .from("subscriptions")
          .insert({
            user_id: user.id,
            subscribed_to_restaurant: restaurantName,
          });

        if (error) throw error;
        toast.success(`Subscribed to ${restaurantName}`);
      }
    } catch (error) {
      console.error("Error managing subscription:", error);
      toast.error("Failed to update subscription");
    }
  };

  const isSubscribed = (restaurantName: string) => {
    return subscriptions?.some(
      sub => sub.subscribed_to_restaurant === restaurantName
    );
  };

  const handleSearch = (value: string) => {
    setSearchParams({
      q: value,
      category,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex gap-4">
            <SearchInput value={query} onChange={handleSearch} />
          </div>

          <Tabs
            value={category}
            onValueChange={(value) =>
              setSearchParams({
                q: query,
                category: value,
              })
            }
          >
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
              <TabsTrigger
                value="people"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                People
              </TabsTrigger>
              <TabsTrigger
                value="restaurants"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                Restaurants
              </TabsTrigger>
            </TabsList>

            <TabsContent value="people" className="mt-6">
              <UsersList profiles={userResults || []} />
            </TabsContent>

            <TabsContent value="restaurants" className="mt-6">
              <RestaurantsList 
                restaurants={restaurantResults || []} 
                onSubscribe={handleSubscribe}
                isSubscribed={isSubscribed}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
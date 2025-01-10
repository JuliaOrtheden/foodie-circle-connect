import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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

  const { data: searchResults } = useQuery({
    queryKey: ["search", category, query],
    queryFn: async () => {
      if (category === "people") {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .ilike("username", query ? `%${query}%` : '%')
          .limit(20);
        return data || [];
      } else {
        const { data } = await supabase
          .from("dishes")
          .select("restaurant")
          .ilike("restaurant", query ? `%${query}%` : '%')
          .not("restaurant", "is", null)
          .limit(20);
        
        const uniqueRestaurants = [...new Set(data?.map(d => d.restaurant))];
        return uniqueRestaurants.map(restaurant => ({ restaurant }));
      }
    },
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex gap-4">
            <Input
              type="search"
              placeholder="Search..."
              value={query}
              onChange={(e) =>
                setSearchParams({
                  q: e.target.value,
                  category,
                })
              }
              className="flex-1"
            />
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
              <div className="space-y-4">
                {searchResults?.map((profile: any) => (
                  <div
                    key={profile.id}
                    className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm"
                  >
                    <Avatar className="h-12 w-12" />
                    <div className="flex-1">
                      <Link
                        to={`/profile/${profile.id}`}
                        className="font-medium hover:underline"
                      >
                        {profile.username || "Anonymous User"}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="restaurants" className="mt-6">
              <div className="space-y-4">
                {searchResults?.map((result: any) => (
                  <div
                    key={result.restaurant}
                    className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm"
                  >
                    <div className="flex-1">
                      <Link
                        to={`/restaurant/${encodeURIComponent(result.restaurant)}`}
                        className="font-medium hover:underline"
                      >
                        {result.restaurant}
                      </Link>
                    </div>
                    <button
                      onClick={() => handleSubscribe(result.restaurant)}
                      className={`p-2 rounded-full hover:bg-gray-100 ${
                        isSubscribed(result.restaurant) ? "text-red-500" : ""
                      }`}
                    >
                      <Heart
                        className={isSubscribed(result.restaurant) ? "fill-current" : ""}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
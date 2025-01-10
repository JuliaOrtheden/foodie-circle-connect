import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Search = () => {
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
          .ilike("username", `%${query}%`)
          .limit(20);
        return data || [];
      } else {
        const { data } = await supabase
          .from("dishes")
          .select("*")
          .ilike("restaurant", `%${query}%`)
          .limit(20);
        return data || [];
      }
    },
    enabled: query.length > 0,
  });

  const handleSubscribe = async (restaurantName: string) => {
    if (!user) {
      toast.error("Please sign in to subscribe to restaurants");
      return;
    }

    const { error } = await supabase.from("subscriptions").insert({
      user_id: user.id,
      subscribed_to_restaurant: restaurantName,
    });

    if (error) {
      toast.error("Failed to subscribe to restaurant");
    } else {
      toast.success(`Subscribed to ${restaurantName}`);
    }
  };

  const isSubscribed = (restaurantName: string) => {
    return subscriptions?.some(
      (sub) => sub.subscribed_to_restaurant === restaurantName
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
                        {profile.username}
                      </Link>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="restaurants" className="mt-6">
              <div className="space-y-4">
                {searchResults?.map((dish: any) => (
                  <div
                    key={dish.id}
                    className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm"
                  >
                    <div className="flex-1">
                      <Link
                        to={`/restaurant/${encodeURIComponent(dish.restaurant)}`}
                        className="font-medium hover:underline"
                      >
                        {dish.restaurant}
                      </Link>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSubscribe(dish.restaurant)}
                      className={isSubscribed(dish.restaurant) ? "text-red-500" : ""}
                    >
                      <Heart
                        className={isSubscribed(dish.restaurant) ? "fill-current" : ""}
                      />
                    </Button>
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

export default Search;
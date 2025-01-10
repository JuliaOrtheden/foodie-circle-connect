import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { UserPlus, Store } from "lucide-react";

export const SubscriptionManager = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [restaurant, setRestaurant] = useState("");
  const [username, setUsername] = useState("");

  const { data: subscriptions } = useQuery({
    queryKey: ["subscriptions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*, subscribed_to_user_id(username), subscribed_to_restaurant")
        .eq("user_id", user?.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const subscriptionMutation = useMutation({
    mutationFn: async ({
      type,
      value,
    }: {
      type: "user" | "restaurant";
      value: string;
    }) => {
      if (type === "user") {
        // First get the user ID from the username
        const { data: userData, error: userError } = await supabase
          .from("profiles")
          .select("id")
          .eq("username", value)
          .single();

        if (userError || !userData) {
          throw new Error("User not found");
        }

        const { error } = await supabase.from("subscriptions").insert({
          user_id: user?.id,
          subscribed_to_user_id: userData.id,
        });

        if (error) throw error;
      } else {
        const { error } = await supabase.from("subscriptions").insert({
          user_id: user?.id,
          subscribed_to_restaurant: value,
        });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success("Subscription added successfully!");
      setRestaurant("");
      setUsername("");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const unsubscribeMutation = useMutation({
    mutationFn: async (subscriptionId: string) => {
      const { error } = await supabase
        .from("subscriptions")
        .delete()
        .eq("id", subscriptionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success("Unsubscribed successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Subscribe to Updates</h3>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button
              onClick={() =>
                subscriptionMutation.mutate({ type: "user", value: username })
              }
              disabled={!username}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Follow User
            </Button>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Enter restaurant name"
              value={restaurant}
              onChange={(e) => setRestaurant(e.target.value)}
            />
            <Button
              onClick={() =>
                subscriptionMutation.mutate({ type: "restaurant", value: restaurant })
              }
              disabled={!restaurant}
            >
              <Store className="h-4 w-4 mr-2" />
              Follow Restaurant
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Subscriptions</h3>
        <div className="space-y-2">
          {subscriptions?.map((sub) => (
            <div
              key={sub.id}
              className="flex justify-between items-center p-3 bg-secondary rounded-lg"
            >
              <span>
                {sub.subscribed_to_user_id
                  ? `User: ${sub.subscribed_to_user_id.username}`
                  : `Restaurant: ${sub.subscribed_to_restaurant}`}
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => unsubscribeMutation.mutate(sub.id)}
              >
                Unsubscribe
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
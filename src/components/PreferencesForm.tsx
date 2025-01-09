import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface PreferencesFormData {
  favorite_cuisine: string;
  dietary_restrictions: string;
  spice_preference: number;
}

export function PreferencesForm() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit } = useForm<PreferencesFormData>();

  const onSubmit = async (data: PreferencesFormData) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('taste_preferences')
        .upsert({
          user_id: user.id,
          favorite_cuisine: data.favorite_cuisine.split(',').map(c => c.trim()),
          dietary_restrictions: data.dietary_restrictions.split(',').map(r => r.trim()),
          spice_preference: data.spice_preference,
        });

      if (error) throw error;
      
      toast.success("Preferences updated successfully!");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to update preferences");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          {...register("favorite_cuisine")}
          placeholder="Favorite cuisines (comma-separated)"
          className="w-full"
        />
      </div>
      <div>
        <Input
          {...register("dietary_restrictions")}
          placeholder="Dietary restrictions (comma-separated)"
          className="w-full"
        />
      </div>
      <div>
        <Input
          {...register("spice_preference", { 
            min: 1, 
            max: 5,
            valueAsNumber: true 
          })}
          type="number"
          placeholder="Spice preference (1-5)"
          className="w-full"
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update Preferences"}
      </Button>
    </form>
  );
}
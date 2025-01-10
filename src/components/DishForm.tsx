import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ImageUpload } from "./ImageUpload";
import { Label } from "@/components/ui/label";

interface DishFormData {
  name: string;
  restaurant?: string;
  rating?: number;
  notes?: string;
}

export function DishForm() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<DishFormData>();

  const onSubmit = async (data: DishFormData) => {
    console.log('Form submitted with data:', { ...data, imageUrl });
    
    if (!user) {
      console.log('No user found, showing error toast');
      toast.error("Please sign in to log a dish");
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Inserting dish into database...');
      const { error, data: insertedData } = await supabase
        .from('dishes')
        .insert({
          ...data,
          user_id: user.id,
          image_url: imageUrl,
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      
      console.log('Dish inserted successfully:', insertedData);
      toast.success("Dish logged successfully!");
      reset();
      setImageUrl(null);
    } catch (error) {
      console.error('Error in onSubmit:', error);
      toast.error("Failed to log dish. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Dish Name *</Label>
        <Input
          id="name"
          {...register("name", { 
            required: "Dish name is required",
            minLength: { value: 2, message: "Name must be at least 2 characters" }
          })}
          placeholder="Enter dish name"
          className="w-full"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="restaurant">Restaurant</Label>
        <Input
          id="restaurant"
          {...register("restaurant")}
          placeholder="Where did you eat this dish?"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rating">Rating (1-5)</Label>
        <Input
          id="rating"
          {...register("rating", { 
            min: { value: 1, message: "Rating must be at least 1" },
            max: { value: 5, message: "Rating must not exceed 5" },
            valueAsNumber: true 
          })}
          type="number"
          placeholder="How would you rate this dish?"
          className="w-full"
        />
        {errors.rating && (
          <p className="text-sm text-red-500">{errors.rating.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...register("notes")}
          placeholder="Any additional thoughts about the dish?"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label>Photo</Label>
        <ImageUpload
          onImageUpload={(url) => {
            console.log('Image uploaded, received URL:', url);
            setImageUrl(url);
          }}
          onError={(error) => {
            console.error('Image upload error:', error);
            toast.error("Failed to upload image: " + error.message);
          }}
        />
      </div>

      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Logging..." : "Log Dish"}
      </Button>
    </form>
  );
}
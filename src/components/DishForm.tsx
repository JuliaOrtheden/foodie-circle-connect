import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ImageUpload } from "./ImageUpload";
import { Label } from "@/components/ui/label";
import { Heart, Briefcase, Users, Home, Beer } from "lucide-react";

interface DishFormData {
  name: string;
  restaurant?: string;
  notes?: string;
}

type AtmosphereCategory = "date" | "after work" | "business dinner" | "going out with friends" | "family gatherings";

const atmosphereCategories: { value: AtmosphereCategory; label: string; icon: JSX.Element }[] = [
  { value: "date", label: "Date Night 💑", icon: <Heart className="h-4 w-4" /> },
  { value: "after work", label: "After Work 🍺", icon: <Beer className="h-4 w-4" /> },
  { value: "business dinner", label: "Business Dinner 💼", icon: <Briefcase className="h-4 w-4" /> },
  { value: "going out with friends", label: "With Friends 👥", icon: <Users className="h-4 w-4" /> },
  { value: "family gatherings", label: "Family Time 🏠", icon: <Home className="h-4 w-4" /> },
];

export function DishForm() {
  const { user, profile, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [atmosphereRating, setAtmosphereRating] = useState<number>(0);
  const [selectedAtmosphere, setSelectedAtmosphere] = useState<AtmosphereCategory | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<DishFormData>();

  useEffect(() => {
    console.log('Auth state changed:', { user, profile, loading });
  }, [user, profile, loading]);

  const onSubmit = async (data: DishFormData) => {
    console.log('Starting form submission...');
    console.log('Current auth state:', { user, profile, loading });

    if (loading) {
      console.log('Auth state is still loading, waiting...');
      return;
    }

    if (!user) {
      console.log('No user found in auth state');
      toast.error("Please sign in to log a dish");
      return;
    }

    if (!profile) {
      console.log('No profile found for user:', user.id);
      toast.error("Unable to find your profile. Please try signing out and back in.");
      return;
    }

    console.log('Starting submission with profile:', profile.id);
    console.log('Form data:', data);
    console.log('Selected rating:', selectedRating);
    console.log('Atmosphere rating:', atmosphereRating);
    console.log('Selected atmosphere:', selectedAtmosphere);
    console.log('Image URL:', imageUrl);

    const formDataWithRatings = {
      ...data,
      rating: selectedRating || null,
      atmosphere: atmosphereRating ? String(atmosphereRating) : null,
      place: selectedAtmosphere,
      user_id: profile.id,
    };
    
    console.log('Prepared form data:', formDataWithRatings);
    
    setIsLoading(true);
    try {
      console.log('Inserting dish into database...');
      const { error, data: insertedData } = await supabase
        .from('dishes')
        .insert({
          ...formDataWithRatings,
          image_url: imageUrl,
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        toast.error(`Failed to log dish: ${error.message}`);
        return;
      }
      
      console.log('Dish inserted successfully:', insertedData);
      toast.success("Dish logged successfully!");
      reset();
      setImageUrl(null);
      setSelectedRating(0);
      setAtmosphereRating(0);
      setSelectedAtmosphere(null);
    } catch (error) {
      console.error('Error in onSubmit:', error);
      toast.error("Failed to log dish. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderForks = () => {
    const forks = [];
    for (let i = 1; i <= 5; i++) {
      forks.push(
        <button
          key={i}
          type="button"
          onClick={() => setSelectedRating(i)}
          className={`text-2xl transition-all ${
            i <= selectedRating ? 'opacity-100 scale-110' : 'opacity-50 scale-100'
          } hover:scale-110 focus:outline-none`}
          aria-label={`Rate ${i} forks`}
        >
          🍴
        </button>
      );
    }
    return forks;
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => setAtmosphereRating(i)}
          className={`text-2xl transition-all ${
            i <= atmosphereRating ? 'opacity-100 scale-110' : 'opacity-50 scale-100'
          } hover:scale-110 focus:outline-none`}
          aria-label={`Rate atmosphere ${i} stars`}
        >
          ⭐
        </button>
      );
    }
    return stars;
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
        <Label>Dish Rating</Label>
        <div className="flex gap-2 items-center">
          {renderForks()}
          <span className="ml-2 text-sm text-gray-600">
            {selectedRating > 0 ? `${selectedRating} fork${selectedRating > 1 ? 's' : ''}` : 'No rating'}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Atmosphere Rating (Optional)</Label>
        <div className="flex gap-2 items-center">
          {renderStars()}
          <span className="ml-2 text-sm text-gray-600">
            {atmosphereRating > 0 ? `${atmosphereRating} star${atmosphereRating > 1 ? 's' : ''}` : 'No rating'}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Atmosphere Category (Optional)</Label>
        <div className="grid grid-cols-2 gap-2">
          {atmosphereCategories.map((category) => (
            <Button
              key={category.value}
              type="button"
              variant={selectedAtmosphere === category.value ? "default" : "outline"}
              className="flex items-center gap-2 w-full"
              onClick={() => setSelectedAtmosphere(category.value)}
            >
              {category.icon}
              <span>{category.label}</span>
            </Button>
          ))}
        </div>
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
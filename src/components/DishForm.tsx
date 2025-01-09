import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface DishFormData {
  name: string;
  restaurant?: string;
  rating?: number;
  notes?: string;
}

export function DishForm() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { register, handleSubmit, reset } = useForm<DishFormData>();

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError, data } = await supabase.storage
      .from('dish-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('dish-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const onSubmit = async (data: DishFormData) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const { error } = await supabase
        .from('dishes')
        .insert({
          ...data,
          user_id: user.id,
          image_url: imageUrl,
        });

      if (error) throw error;
      
      toast.success("Dish logged successfully!");
      reset();
      setImageFile(null);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to log dish");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          {...register("name", { required: true })}
          placeholder="Dish name"
          className="w-full"
        />
      </div>
      <div>
        <Input
          {...register("restaurant")}
          placeholder="Restaurant (optional)"
          className="w-full"
        />
      </div>
      <div>
        <Input
          {...register("rating", { 
            min: 1, 
            max: 5,
            valueAsNumber: true 
          })}
          type="number"
          placeholder="Rating (1-5)"
          className="w-full"
        />
      </div>
      <div>
        <Textarea
          {...register("notes")}
          placeholder="Notes (optional)"
          className="w-full"
        />
      </div>
      <div>
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Logging..." : "Log Dish"}
      </Button>
    </form>
  );
}
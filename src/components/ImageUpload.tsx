import { useState } from "react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  onError: (error: Error) => void;
}

export function ImageUpload({ onImageUpload, onError }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    try {
      setIsUploading(true);
      const { error: uploadError } = await supabase.storage
        .from('dish-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('dish-images')
        .getPublicUrl(filePath);

      onImageUpload(publicUrl);
    } catch (error) {
      onError(error as Error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadImage(e.target.files[0]);
    }
  };

  return (
    <Input
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      disabled={isUploading}
      className="w-full"
    />
  );
}
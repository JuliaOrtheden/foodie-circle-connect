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
    console.log('Starting image upload:', file.name);
    const fileExt = file.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    try {
      setIsUploading(true);
      console.log('Uploading to path:', filePath);
      
      const { error: uploadError } = await supabase.storage
        .from('dish-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('dish-images')
        .getPublicUrl(filePath);

      console.log('Upload successful, public URL:', publicUrl);
      onImageUpload(publicUrl);
    } catch (error) {
      console.error('Error in uploadImage:', error);
      onError(error as Error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      console.log('File selected:', e.target.files[0].name);
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
import { Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface DishCardProps {
  image: string;
  name: string;
  restaurant: string;
  rating: number;
  likes: number;
  className?: string;
}

export function DishCard({ image, name, restaurant, rating, likes, className }: DishCardProps) {
  return (
    <div className={cn("group relative overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg animate-fade-in", className)}>
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
        <p className="text-sm text-gray-600">{restaurant}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">{likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
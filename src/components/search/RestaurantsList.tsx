import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";

export interface Restaurant {
  restaurant: string;
  atmosphereRating?: string;
}

interface RestaurantsListProps {
  restaurants: Restaurant[];
  onSubscribe: (restaurantName: string) => void;
  isSubscribed: (restaurantName: string) => boolean;
}

export const RestaurantsList = ({ 
  restaurants, 
  onSubscribe, 
  isSubscribed 
}: RestaurantsListProps) => {
  return (
    <div className="space-y-4">
      {restaurants?.map((result) => (
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
            {result.atmosphereRating && (
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-gray-600">
                  Atmosphere: {result.atmosphereRating}/5
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => onSubscribe(result.restaurant)}
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
  );
};
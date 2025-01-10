import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export interface Restaurant {
  restaurant: string;
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
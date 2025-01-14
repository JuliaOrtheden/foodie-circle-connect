import { DishCard } from "./DishCard";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MapPin } from "lucide-react";

const FRIENDS_POSTS = [
  {
    id: 1,
    user: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    },
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    name: "Dragon Roll",
    restaurant: "Sushi Master",
    location: "Boston, MA",
    rating: 4.5,
    likes: 42,
    timeAgo: "2h ago",
    atmosphere: "4.3",
    place: "date",
    description: "Best dragon roll I've had in Boston! The presentation was amazing and the flavors were perfectly balanced.",
  },
  {
    id: 2,
    user: {
      name: "Mike Johnson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    },
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    name: "Burger Deluxe",
    restaurant: "Burger & Co",
    location: "Cambridge, MA",
    rating: 4.6,
    likes: 38,
    timeAgo: "5h ago",
    atmosphere: "4.7",
    place: "family gatherings",
    description: "The perfect burger doesn't exi- WAIT! This might be it! Perfectly cooked and seasoned.",
  },
];

export function FriendsFeed() {
  return (
    <section className="space-y-6">
      {FRIENDS_POSTS.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 flex items-center gap-3">
            <Avatar>
              <AvatarImage src={post.user.avatar} />
              <AvatarFallback>{post.user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-medium">{post.user.name}</h3>
              <div className="flex items-center text-sm text-gray-500 gap-1">
                <MapPin className="h-4 w-4" />
                <span>{post.restaurant} · {post.location}</span>
              </div>
            </div>
          </div>
          
          <DishCard {...post} className="rounded-none shadow-none" />
          
          <div className="p-4">
            <p className="text-gray-600">{post.description}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
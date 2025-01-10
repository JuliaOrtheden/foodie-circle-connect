import { DishCard } from "./DishCard";

const FRIENDS_POSTS = [
  {
    id: 1,
    user: "Sarah",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    name: "Sushi Platter",
    restaurant: "Sakura Sushi",
    rating: 4.5,
    likes: 42,
    timeAgo: "2h ago",
    atmosphere: "4.3",
    place: "date",
  },
  {
    id: 2,
    user: "Mike",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    name: "Pizza Margherita",
    restaurant: "Napoli's",
    rating: 4.6,
    likes: 38,
    timeAgo: "5h ago",
    atmosphere: "4.7",
    place: "family gatherings",
  },
];

export function FriendsFeed() {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Friends' Recent Meals</h2>
      <div className="space-y-6">
        {FRIENDS_POSTS.map((post) => (
          <div key={post.id} className="animate-slide-up">
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium text-gray-900">{post.user}</span> • {post.timeAgo}
            </p>
            <DishCard {...post} />
          </div>
        ))}
      </div>
    </section>
  );
}
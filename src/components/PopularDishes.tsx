import { DishCard } from "./DishCard";

const POPULAR_DISHES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    name: "Truffle Pasta",
    restaurant: "La Cucina",
    rating: 4.8,
    likes: 234,
    atmosphere: "4.2",
    place: "date",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    name: "Wagyu Burger",
    restaurant: "Gourmet Bites",
    rating: 4.7,
    likes: 189,
    atmosphere: "4.5",
    place: "business dinner",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    name: "Matcha Tiramisu",
    restaurant: "Sweet Dreams",
    rating: 4.9,
    likes: 312,
    atmosphere: "4.8",
    place: "going out with friends",
  },
];

export function PopularDishes() {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Near You</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {POPULAR_DISHES.map((dish) => (
          <DishCard key={dish.id} {...dish} />
        ))}
      </div>
    </section>
  );
}
import { Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { SearchInput } from "@/components/search/SearchInput";
import { SearchFilters } from "@/components/search/SearchFilters";
import { UsersList } from "@/components/search/UsersList";
import { RestaurantsList } from "@/components/search/RestaurantsList";
import { LoginButton } from "@/components/LoginButton";
import { useSearchState } from "@/hooks/useSearchState";
import { useUserSearch } from "@/hooks/useUserSearch";
import { useRestaurantSearch } from "@/hooks/useRestaurantSearch";
import { useRestaurantSubscriptions } from "@/hooks/useRestaurantSubscriptions";
import Map from "@/components/search/Map";

const SearchPage = () => {
  const { query, category, city, cuisine, atmosphere, updateSearch } = useSearchState();
  const { user } = useAuth();
  const { data: userResults } = useUserSearch(query);
  const { data: restaurantResults } = useRestaurantSearch(query, city, cuisine, atmosphere);
  const { handleSubscribe, isSubscribed } = useRestaurantSubscriptions();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header section */}
        <header className="flex justify-between items-center mb-12">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              <Link to="/">FoodieCircle</Link>
            </h1>
            <p className="text-lg text-gray-600">Discover and share amazing dishes</p>
          </div>
          <div className="flex items-center">
            <LoginButton />
          </div>
        </header>

        <div className="max-w-3xl mx-auto space-y-6">
          <div className="space-y-4">
            <SearchInput 
              value={query} 
              onChange={(value) => updateSearch({ q: value })} 
            />
            {category === "restaurants" && (
              <SearchFilters
                city={city}
                cuisine={cuisine}
                atmosphere={atmosphere}
                onCityChange={(value) => updateSearch({ city: value })}
                onCuisineChange={(value) => updateSearch({ cuisine: value })}
                onAtmosphereChange={(value) => updateSearch({ atmosphere: value })}
              />
            )}
          </div>

          <Tabs
            value={category}
            onValueChange={(value) => updateSearch({ category: value })}
          >
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
              <TabsTrigger
                value="people"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                People
              </TabsTrigger>
              <TabsTrigger
                value="restaurants"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                Restaurants
              </TabsTrigger>
            </TabsList>

            <TabsContent value="people" className="mt-6">
              <UsersList profiles={userResults || []} />
            </TabsContent>

            <TabsContent value="restaurants" className="mt-6">
              {restaurantResults && restaurantResults.length > 0 ? (
                <RestaurantsList 
                  restaurants={restaurantResults} 
                  onSubscribe={handleSubscribe}
                  isSubscribed={isSubscribed}
                />
              ) : (
                <div className="space-y-4">
                  <p className="text-center text-gray-600">
                    {query ? "No restaurants found. Try adjusting your search." : "Explore our interactive map to discover restaurants around the world."}
                  </p>
                  <Map />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
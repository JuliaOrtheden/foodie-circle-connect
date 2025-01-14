import { useSearchParams } from "react-router-dom";

export const useSearchState = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "restaurants";
  const city = searchParams.get("city") || "";
  const cuisine = searchParams.get("cuisine") || "";
  const atmosphere = searchParams.get("atmosphere") || "";

  const updateSearch = (params: {
    q?: string;
    category?: string;
    city?: string;
    cuisine?: string;
    atmosphere?: string;
  }) => {
    setSearchParams({
      q: params.q ?? query,
      category: params.category ?? category,
      city: params.city ?? city,
      cuisine: params.cuisine ?? cuisine,
      atmosphere: params.atmosphere ?? atmosphere,
    });
  };

  return {
    query,
    category,
    city,
    cuisine,
    atmosphere,
    updateSearch,
  };
};
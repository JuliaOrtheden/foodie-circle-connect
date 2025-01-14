import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Heart, Briefcase, Users, Home, Beer } from "lucide-react";

interface SearchFiltersProps {
  city: string;
  cuisine: string;
  atmosphere: string;
  onCityChange: (value: string) => void;
  onCuisineChange: (value: string) => void;
  onAtmosphereChange: (value: string) => void;
}

const atmosphereCategories = [
  { value: "date", label: "Date Night 💑", icon: <Heart className="h-4 w-4" /> },
  { value: "after work", label: "After Work 🍺", icon: <Beer className="h-4 w-4" /> },
  { value: "business dinner", label: "Business Dinner 💼", icon: <Briefcase className="h-4 w-4" /> },
  { value: "going out with friends", label: "With Friends 👥", icon: <Users className="h-4 w-4" /> },
  { value: "family gatherings", label: "Family Time 🏠", icon: <Home className="h-4 w-4" /> },
];

export const SearchFilters = ({ 
  city, 
  cuisine, 
  atmosphere,
  onCityChange, 
  onCuisineChange,
  onAtmosphereChange
}: SearchFiltersProps) => {
  const { data: cities } = useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const { data } = await supabase
        .from('dishes')
        .select('place')
        .not('place', 'is', null);
      
      const uniqueCities = [...new Set(data?.map(d => d.place))];
      return uniqueCities.filter(Boolean) as string[];
    }
  });

  const { data: cuisines } = useQuery({
    queryKey: ['cuisines'],
    queryFn: async () => {
      const { data } = await supabase
        .from('taste_preferences')
        .select('favorite_cuisine');
      
      const allCuisines = data?.flatMap(d => d.favorite_cuisine || []) || [];
      const uniqueCuisines = [...new Set(allCuisines)];
      return uniqueCuisines.filter(Boolean);
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Select value={city === "" ? "all" : city} onValueChange={value => onCityChange(value === "all" ? "" : value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by city" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All cities</SelectItem>
            {cities?.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={cuisine === "" ? "all" : cuisine} onValueChange={value => onCuisineChange(value === "all" ? "" : value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by cuisine" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All cuisines</SelectItem>
            {cuisines?.map((cuisine) => (
              <SelectItem key={cuisine} value={cuisine}>
                {cuisine}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={atmosphere === "" ? "default" : "outline"}
          onClick={() => onAtmosphereChange("")}
          className="text-sm"
        >
          All occasions
        </Button>
        {atmosphereCategories.map((category) => (
          <Button
            key={category.value}
            variant={atmosphere === category.value ? "default" : "outline"}
            onClick={() => onAtmosphereChange(category.value)}
            className="flex items-center gap-2 text-sm"
          >
            {category.icon}
            {category.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
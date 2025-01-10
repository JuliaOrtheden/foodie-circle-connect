import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SearchFiltersProps {
  city: string;
  cuisine: string;
  onCityChange: (value: string) => void;
  onCuisineChange: (value: string) => void;
}

export const SearchFilters = ({ 
  city, 
  cuisine, 
  onCityChange, 
  onCuisineChange 
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
    <div className="flex gap-4">
      <Select value={city} onValueChange={onCityChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by city" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All cities</SelectItem>
          {cities?.map((city) => (
            <SelectItem key={city} value={city}>
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={cuisine} onValueChange={onCuisineChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by cuisine" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All cuisines</SelectItem>
          {cuisines?.map((cuisine) => (
            <SelectItem key={cuisine} value={cuisine}>
              {cuisine}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
import { Link } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";
import { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

interface UsersListProps {
  profiles: Profile[];
}

export const UsersList = ({ profiles }: UsersListProps) => {
  return (
    <div className="space-y-4">
      {profiles?.map((profile) => (
        <div
          key={profile.id}
          className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm"
        >
          <Avatar className="h-12 w-12" />
          <div className="flex-1">
            <Link
              to={`/profile/${profile.id}`}
              className="font-medium hover:underline"
            >
              {profile.username || "Anonymous User"}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};
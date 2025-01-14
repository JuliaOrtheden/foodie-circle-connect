import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function CreatePostPrompt() {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
      <Avatar className="h-12 w-12">
        <AvatarImage src={user.user_metadata?.avatar_url} />
        <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">What are you eating?</h3>
        <p className="text-sm text-gray-500">Share your dish!</p>
      </div>
      <button className="rounded-full bg-primary p-2 text-white">
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
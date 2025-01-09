import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function LoginButton() {
  const { user, signInWithGoogle, signOut } = useAuth();

  return user ? (
    <Button 
      variant="outline" 
      onClick={signOut}
      className="animate-fade-in"
    >
      Sign Out
    </Button>
  ) : (
    <Button 
      onClick={signInWithGoogle}
      className="animate-fade-in"
    >
      Sign in with Google
    </Button>
  );
}
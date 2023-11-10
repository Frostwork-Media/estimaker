import { Button } from "@/components/button";
import {
  useAuth,
  SignInButton,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";

export default function Landing() {
  const { isSignedIn } = useAuth();
  return (
    <div className="p-12">
      <h1 className="text-3xl font-extrabold mb-6">estimaker</h1>
      {isSignedIn ? (
        <Button>Go To Dashboard</Button>
      ) : (
        <SignInButton afterSignInUrl="/projects" afterSignUpUrl="/projects">
          Log In
        </SignInButton>
      )}
    </div>
  );
}

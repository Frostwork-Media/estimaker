import { SignInButton, useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function Landing() {
  const { isSignedIn } = useAuth();
  return (
    <div className="p-12">
      <h1 className="text-3xl font-extrabold mb-6">estimaker</h1>
      {isSignedIn ? (
        <Link to="/projects">Go To Dashboard</Link>
      ) : (
        <SignInButton afterSignInUrl="/projects" afterSignUpUrl="/projects">
          Log In
        </SignInButton>
      )}
    </div>
  );
}

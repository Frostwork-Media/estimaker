import { useClerk } from "@clerk/clerk-react";

export default function Landing() {
  const { redirectToSignIn } = useClerk();
  return (
    <div className="p-12">
      <h1 className="text-3xl font-extrabold mb-6">estimaker</h1>
      <button
        className="px-3 py-2 rounded-md bg-foreground text-background font-bold"
        onClick={() =>
          redirectToSignIn({
            redirectUrl: "/projects",
          })
        }
      >
        Log In
      </button>
    </div>
  );
}

import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/clerk-react";
import { QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, useEffect } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import { queryClient } from "./lib/queryClient";
const Landing = lazy(() => import("./pages/Landing"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Project = lazy(() => import("./pages/Project"));
import { Toaster } from "./components/ui/toaster";
import { amplitudeRegisterUser, useAmplitude } from "./lib/analytics";
import * as loaders from "./lib/loaders";
import { LogRocket } from "./lib/logrocket";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/projects",
    element: (
      <AuthWall>
        <Outlet />
      </AuthWall>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: ":id",
        loader: loaders.project,
        element: <Project />,
      },
    ],
  },
]);

export default function App() {
  useAmplitude();
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div>Loading...</div>}>
          <RouterProvider router={router} />
        </Suspense>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function AuthWall({ children }: { children: React.ReactNode }) {
  const user = useUser();
  const id = user.user?.id;
  const name = user.user?.fullName;
  const email = user.user?.emailAddresses[0]?.emailAddress;
  useEffect(() => {
    if (email) amplitudeRegisterUser(email);
  }, [email]);

  useEffect(() => {
    if (id && name && email) LogRocket.identify(id, { name, email });
  }, [email, id, name]);
  return (
    <>
      <SignedIn>
        {children}
        <Toaster />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

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
import Landing from "./pages/Landing";
import PrivacyPolicy from "./pages/PrivacyPolicy";
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Project = lazy(() => import("./pages/Project"));
import { FullPageLoader } from "./components/FullPageLoader";
import { Toaster } from "./components/ui/toaster";
import { amplitudeRegisterUser, useAmplitude } from "./lib/analytics";
import * as loaders from "./lib/loaders";
import { LogRocket } from "./lib/logrocket";
import { New } from "./pages/New";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/privacy",
    element: <PrivacyPolicy />,
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
      {
        path: "new",
        element: <New />,
      },
    ],
  },
]);

export default function App() {
  useAmplitude();
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      afterSignInUrl="/projects"
      afterSignUpUrl="/projects"
    >
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<FullPageLoader />}>
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
    // Only identify in production
    if (__VERCEL_ENV__ !== "production") return;

    if (id && name && email) LogRocket.identify(id, { name, email });
  }, [email, id, name]);
  return (
    <>
      <SignedIn>
        {children}
        <Toaster />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn
          afterSignInUrl={window.location.pathname}
          afterSignUpUrl={window.location.pathname}
        />
      </SignedOut>
    </>
  );
}

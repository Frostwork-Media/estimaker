import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { QueryClientProvider } from "@tanstack/react-query";
import { lazy,Suspense } from "react";
import { createBrowserRouter,Outlet, RouterProvider } from "react-router-dom";

import { queryClient } from "./lib/queryClient";
const Landing = lazy(() => import("./pages/Landing"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Project = lazy(() => import("./pages/Project"));
import * as loaders from "./lib/loaders";

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
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

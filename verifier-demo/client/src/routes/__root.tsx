import { NavBar } from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import { AuthContextType } from "@/context/authContextProvider";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import React, { Suspense } from "react";

interface RouterContext {
  auth: AuthContextType;
}

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null // Render nothing in production
    : React.lazy(() =>
      // Lazy load in development
      import('@tanstack/router-devtools').then((res) => ({
        default: res.TanStackRouterDevtools,
        // For Embedded Mode
        // default: res.TanStackRouterDevtoolsPanel
      })),
    );

// Layout for the entire application
export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <div className="min-h-screen">
        <div className="col-start-2">
          <div>
            <NavBar />
          </div>
          <Outlet />
        </div>
        <Toaster />
        <Suspense>
          <TanStackRouterDevtools />
        </Suspense>
      </div>
    </>
  ),
});

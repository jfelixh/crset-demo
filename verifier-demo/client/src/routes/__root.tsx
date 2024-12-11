import { NavBar } from "@/components/navbar";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Toaster } from "@/components/ui/toaster";

// Layout for the entire application
export const Route = createRootRoute({
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
        <TanStackRouterDevtools />
      </div>
    </>
  ),
});

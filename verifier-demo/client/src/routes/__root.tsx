import { NavBar } from "@/components/navbar";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

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
        <TanStackRouterDevtools />
      </div>
    </>
  ),
});

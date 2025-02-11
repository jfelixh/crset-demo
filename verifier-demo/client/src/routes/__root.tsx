import { NavBar } from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import { AuthContextType } from "@/context/authContextProvider";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

interface RouterContext {
  auth: AuthContextType;
}

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
        <TanStackRouterDevtools />
      </div>
    </>
  ),
});

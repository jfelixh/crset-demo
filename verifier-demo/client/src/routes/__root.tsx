import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

// Layout for the root route
export const Route = createRootRoute({
  component: () => (
    <>
      <div className="grid grid-cols-[1fr_18fr_1fr] min-h-screen">
        <div className="col-start-2 space-y-4">
          <div>
            <nav className="p-2 flex gap-2">
              {/* Navigation bar */}
              <Link to="/" className="[&.active]:font-bold">
                Home
              </Link>{" "}
              <Link to="/about" className="[&.active]:font-bold">
                About
              </Link>
            </nav>
            <hr />
          </div>
          <Outlet />
        </div>
        <TanStackRouterDevtools />
      </div>
    </>
  ),
});

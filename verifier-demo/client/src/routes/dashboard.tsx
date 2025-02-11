import Dashboard from "@/components/dashboard";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: () => <Dashboard />,
  beforeLoad: ({ context, location }) => {
    if (!context.auth.token && !context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

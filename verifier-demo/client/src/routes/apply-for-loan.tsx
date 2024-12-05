import { useAuth } from "@/hooks/useAuth";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = () => {
  const { isAuthenticated } = useAuth();

  return createFileRoute("/apply-for-loan")({
    component: RouteComponent,
    loader: () => {
      if (!isAuthenticated) {
        throw redirect({ to: "/" });
      }
    },
  });
};

function RouteComponent() {
  return (
    <div className="grid grid-cols-[1fr_10fr_1fr] w-full">
      <div className="grid grid-cols-[1fr_10fr_1fr] w-full">
        Hello "/apply-for-loan"!
      </div>
    </div>
  );
}

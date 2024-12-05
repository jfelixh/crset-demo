import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/apply-for-loan")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="grid grid-cols-[1fr_10fr_1fr] w-full">
      <div className="grid grid-cols-[1fr_10fr_1fr] w-full">
        Hello "/apply-for-loan"!
      </div>
    </div>
  );
}

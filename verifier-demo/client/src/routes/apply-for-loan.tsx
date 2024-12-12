import SteppedForm from "@/components/form/stepped-form";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/apply-for-loan")({
  component: RouteComponent,
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

function RouteComponent() {
  return (
    <div className="grid grid-cols-[1fr_10fr_1fr] w-full py-10">
      <div className="col-start-2 w-full flex justify-center">
        <div className="lg:w-[85%] w-full min-h-[90vh]">
          <SteppedForm />
        </div>
      </div>
    </div>
  );
}

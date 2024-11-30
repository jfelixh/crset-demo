import { createLazyFileRoute } from "@tanstack/react-router";

// Creates a lazy route. For our purposes, we're just going to use a simple createFileRoute
// Don't forget to update the file name to about.tsx
export const Route = createLazyFileRoute("/about")({
  component: About,
});

function About() {
  return <div className="p-2">Hello from About!</div>;
}

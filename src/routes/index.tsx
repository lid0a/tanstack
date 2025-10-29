import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <h1>Home page</h1>
      <Link to="/todos" search={{ page: 1, limit: 10 }} className="link">
        Go to todos
      </Link>
    </>
  );
}

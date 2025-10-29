import * as React from "react";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Container } from "~/ui/shared/container";
import { Toaster } from "~/components/ui/sonner";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <Container>
        <nav className="py-4 mb-8 border-b border-border">
          <Link to="/" className="link">
            Home
          </Link>
        </nav>
        <Outlet />
      </Container>
      <Toaster />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </React.Fragment>
  );
}

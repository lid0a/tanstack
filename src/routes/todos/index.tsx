import { createFileRoute, Link } from "@tanstack/react-router";
import { List } from "~/ui/todos/list";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { PlusIcon } from "lucide-react";

export const Route = createFileRoute("/todos/")({
  component: RouteComponent,
  validateSearch: z.object({
    page: z.int().min(1).default(1),
    limit: z.int().min(1).default(10),
    search: z.string().optional(),
  }),
});

function RouteComponent() {
  return (
    <>
      <List />
      <Button size="icon-lg" className="fixed top-4 right-4 z-10" asChild>
        <Link to="/todos/new">
          <PlusIcon />
        </Link>
      </Button>
    </>
  );
}

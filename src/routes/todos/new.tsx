import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useCreateTodo } from "~/queries/todos";
import { Form } from "~/ui/todos/form";

export const Route = createFileRoute("/todos/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const { mutate, isPending } = useCreateTodo();

  return (
    <Form
      label="Create new todo"
      defaultValues={{ todo: "", completed: false }}
      onSubmit={(data, _, ctx) => {
        mutate(
          { ...data, userId: 1 },
          {
            onSuccess() {
              toast.success("Created successfully");
              ctx?.reset?.();
            },
            onError(error) {
              toast.error(error.message);
            },
          },
        );
      }}
      disabled={isPending}
    />
  );
}

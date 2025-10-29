import { createFileRoute } from "@tanstack/react-router";
import { useCreateTodo } from "~/api/todos";
import { Form } from "~/ui/todos/form";
import { useMessage } from "~/utils/use-message";

export const Route = createFileRoute("/todos/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const { mutate, isPending, error, isSuccess } = useCreateTodo();

  useMessage("success", isSuccess ? "Created successfully" : null);
  useMessage("error", error?.message);

  return (
    <Form
      label="Create new todo"
      defaultValues={{ todo: "", completed: false }}
      onSubmit={(data) => {
        mutate({ ...data, userId: 1 });
      }}
      disabled={isPending}
    />
  );
}

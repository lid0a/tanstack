import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useTodo, useUpdateTodo } from "~/api/todos";
import { Form } from "~/ui/todos/form";

export const Route = createFileRoute("/todos/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const id = Number(params.id);
  const { data, isPending, error } = useTodo(id);
  const { mutate, isPending: isMutationPending } = useUpdateTodo(id);

  if (isPending) {
    return "Pending...";
  }

  if (error) {
    return error.message;
  }

  return (
    <Form
      label="Edit todo"
      defaultValues={data}
      onSubmit={(data) => {
        mutate(data, {
          onSuccess() {
            toast.success("Updated successfully");
          },
          onError(error) {
            toast.error(error.message);
          },
        });
      }}
      disabled={isMutationPending}
    />
  );
}

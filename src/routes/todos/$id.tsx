import { createFileRoute } from "@tanstack/react-router";
import { useTodo, useUpdateTodo } from "~/api/todos";
import { Form } from "~/ui/todos/form";
import { useMessage } from "~/utils/use-message";

export const Route = createFileRoute("/todos/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const id = Number(params.id);
  const { data, isPending, error } = useTodo(id);
  const {
    mutate,
    error: mutationError,
    isPending: isMutationPending,
    isSuccess: isMutationSuccess,
  } = useUpdateTodo(id);

  useMessage("success", isMutationSuccess ? "Updated successfully" : null);
  useMessage("error", mutationError?.message);

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
        mutate(data);
      }}
      disabled={isMutationPending}
    />
  );
}

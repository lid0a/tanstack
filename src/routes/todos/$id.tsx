import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { queryClient } from "~/queries/client";
import {
  getTodoQueryOptions,
  getTodosQueryOptions,
  useUpdateTodo,
} from "~/queries/todos";
import { ErrorComponent } from "~/ui/shared/error-component";
import { PendingComponent } from "~/ui/shared/pending-component";
import { Form } from "~/ui/todos/form";

export const Route = createFileRoute("/todos/$id")({
  component: RouteComponent,
  pendingComponent: PendingComponent,
  errorComponent: ErrorComponent,
  loaderDeps: ({ search }) => search,
  loader: ({ params }) =>
    queryClient.ensureQueryData(getTodoQueryOptions(Number(params.id))),
});

function RouteComponent() {
  const params = Route.useParams();
  const id = Number(params.id);
  const { data } = useSuspenseQuery(getTodoQueryOptions(id));
  const { mutate, isPending: isMutationPending } = useUpdateTodo(id);
  const queryClient = useQueryClient();

  return (
    <Form
      label="Edit todo"
      defaultValues={data}
      onSubmit={(data) => {
        mutate(data, {
          onSuccess(todo, variables) {
            queryClient.setQueryData(getTodoQueryOptions(id).queryKey, {
              ...todo,
              ...variables,
            });
            queryClient.invalidateQueries({
              queryKey: getTodosQueryOptions().queryKey,
            });
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

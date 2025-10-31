import { useDeleteTodo, useTodos, type Todo } from "~/api/todos";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/ui/shared/data-table";
import { Badge } from "~/components/ui/badge";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import { ButtonGroup } from "~/components/ui/button-group";
import { Button } from "~/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { SearchIcon } from "lucide-react";

const columns: ColumnDef<Todo>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "todo",
    header: "Title",
    cell({ row }) {
      return (
        <Link to="/todos/$id" params={{ id: String(row.original.id) }}>
          {row.original.todo}
        </Link>
      );
    },
  },
  {
    accessorKey: "completed",
    header: "Completed",
    cell({ row }) {
      return row.original.completed ? (
        <Badge>Yes</Badge>
      ) : (
        <Badge variant="destructive">No</Badge>
      );
    },
  },
];

export function List() {
  const { page, limit } = useSearch({ from: "/todos/" });
  const navigate = useNavigate();
  const { data, isPending, error, refetch } = useTodos({
    limit,
    skip: (page - 1) * limit,
  });
  const { mutate } = useDeleteTodo();

  if (isPending) {
    return "Pending...";
  }

  if (error) {
    return error.message;
  }

  return (
    <>
      <div>
        <ButtonGroup>
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput />
          </InputGroup>
          <Button>Search</Button>
        </ButtonGroup>
      </div>
      <DataTable
        columns={columns}
        data={[...data.todos]}
        pagination={{ pageIndex: page - 1, pageSize: limit }}
        onPaginationChange={(updater) => {
          const nextState =
            typeof updater === "function"
              ? updater({ pageIndex: page - 1, pageSize: limit })
              : updater;

          navigate({
            from: "/todos",
            search: {
              page: nextState.pageIndex + 1,
              limit: nextState.pageSize,
            },
          });
        }}
        onDelete={async (items) => {
          for (const item of items) {
            mutate(item.id, {
              onSuccess() {
                toast.success("Deleted successfully");
                refetch();
              },
              onError(error) {
                toast.error(error.message);
              },
            });
          }
        }}
        totalItems={data.total}
        getItemTitle={(item) => item.todo}
      />
    </>
  );
}

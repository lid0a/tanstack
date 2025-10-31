import { useDeleteTodo, useTodos, type Todo } from "~/api/todos";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/ui/shared/data-table";
import { Badge } from "~/components/ui/badge";
import { Checkbox } from "~/components/ui/checkbox";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { create } from "zustand";
import { Button } from "~/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

type Selection = { [key: number]: boolean };

const useSelectedTodos = create<{
  selection: Selection;
  select: (selection: Selection) => void;
}>((set) => ({
  selection: {},
  select: (selection: Selection) => set(() => ({ selection })),
}));

const columns: ColumnDef<Todo>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
  const selectedRows = useSelectedTodos((state) => state.selection);
  const selectRow = useSelectedTodos((state) => state.select);
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
      <div className="h-11 flex items-center">
        {Object.keys(selectedRows).length > 0 && (
          <Button
            size="icon"
            variant="destructive"
            onClick={() => {
              for (const index in selectedRows) {
                const { id } = data.todos[index];
                mutate(id, {
                  async onSuccess() {
                    await refetch();
                    toast.success("Deleted successfully");
                  },
                  onError(error) {
                    toast.error(error.message);
                  },
                });
              }
            }}
          >
            <Trash2 />
          </Button>
        )}
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
        onRowSelectionChange={selectRow}
        totalItems={data.total}
      />
    </>
  );
}

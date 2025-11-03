import { getTodosQueryOptions, useDeleteTodo, type Todo } from "~/api/todos";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/ui/shared/data-table";
import { Badge } from "~/components/ui/badge";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ButtonGroup } from "~/components/ui/button-group";
import { Button } from "~/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { SearchIcon, XIcon } from "lucide-react";
import { create, useStore } from "zustand";
import { useEffect, type FormEvent } from "react";
import { paginationStore, searchStore } from "~/stores/todos";
import { useSuspenseQuery } from "@tanstack/react-query";

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

type SearchState = {
  query: string;
};

type SearchActions = {
  setQuery: (query: string) => void;
};

const useSearch = create<SearchState & SearchActions>((set) => ({
  query: searchStore.getState().query ?? "",
  setQuery: (query: string) => set({ query }),
}));

export function List() {
  const navigate = useNavigate();
  const page = useStore(paginationStore, (state) => state.page);
  const limit = useStore(paginationStore, (state) => state.limit);
  const setPage = useStore(paginationStore, (state) => state.setPage);
  const setLimit = useStore(paginationStore, (state) => state.setLimit);
  const searchQuery = useStore(searchStore, (state) => state.query);
  const setSearchQuery = useStore(searchStore, (state) => state.setQuery);
  const searchInputValue = useSearch((state) => state.query);
  const setSearchInputValue = useSearch((state) => state.setQuery);
  const { data, refetch } = useSuspenseQuery(
    getTodosQueryOptions({
      limit,
      skip: (page - 1) * limit,
      search: searchQuery,
    }),
  );
  const { mutate } = useDeleteTodo();

  useEffect(() => {
    return paginationStore.subscribe((state) => {
      navigate({
        from: "/todos",
        search: {
          page: state.page,
          limit: state.limit,
        },
        replace: true,
      });
    });
  }, []);

  useEffect(() => {
    return searchStore.subscribe((state) => {
      navigate({
        from: "/todos",
        search: {
          search: state.query,
        },
        replace: true,
      });
    });
  }, []);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchQuery(searchInputValue);
  };

  return (
    <>
      <div>
        <form onSubmit={handleSearchSubmit}>
          <ButtonGroup>
            <InputGroup>
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupInput
                value={searchInputValue}
                onChange={(event) => {
                  setSearchInputValue(event.currentTarget.value);
                }}
              />
              <InputGroupAddon align="inline-end">
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => {
                    setSearchInputValue("");
                    setSearchQuery(undefined);
                  }}
                >
                  <XIcon />
                </Button>
              </InputGroupAddon>
            </InputGroup>
            <Button>Search</Button>
          </ButtonGroup>
        </form>
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
          setPage(nextState.pageIndex + 1);
          setLimit(nextState.pageSize);
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

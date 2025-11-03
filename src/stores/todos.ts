import { createStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { searchParamsStorage } from "./persist";

type PaginationState = {
  page: number;
  limit: number;
};

type PaginationActions = {
  setPage: (page: PaginationState["page"]) => void;
  setLimit: (limit: PaginationState["limit"]) => void;
};

type PaginationStore = PaginationState & PaginationActions;

export const paginationStore = createStore<PaginationStore>()(
  persist(
    (set) => ({
      page: 1,
      limit: 10,
      setPage: (page: number) => set(() => ({ page })),
      setLimit: (limit: number) => set(() => ({ limit })),
    }),
    {
      name: "pagination-storage",
      storage: createJSONStorage(() => searchParamsStorage),
    },
  ),
);

type SearchState = {
  query?: string;
};

type SearchActions = {
  setQuery: (query?: string) => void;
};

type SearchStore = SearchState & SearchActions;

export const searchStore = createStore<SearchStore>()(
  persist(
    (set) => ({
      query: new URL(location.href).searchParams.get("search") ?? undefined,
      setQuery: (query?: string) => set({ query }),
    }),
    {
      name: "search-storage",
      storage: createJSONStorage(() => searchParamsStorage),
    },
  ),
);

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
      name: "pagination",
      storage: createJSONStorage(() => searchParamsStorage),
    },
  ),
);

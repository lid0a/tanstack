import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "./request";

export type Todo = {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
};

export type TodoCollection = {
  todos: Todo[];
  total: number;
  skip: number;
  limit: number;
};

export type CreateTodoDto = Pick<Todo, "todo" | "userId"> &
  Partial<Pick<Todo, "completed">>;

export type UpdateTodoDto = Partial<Omit<Todo, "id">>;

export async function getTodos({
  limit = 10,
  skip = 0,
  search,
}: { limit?: number; skip?: number; search?: string } = {}) {
  return await request<TodoCollection>("todos", { limit, skip, search });
}

export async function getTodo(id: number) {
  return await request<Todo>(`todos/${id}`);
}

export async function createTodo(dto: CreateTodoDto) {
  return await request<Todo>("todos/add", undefined, {
    method: "POST",
    body: dto,
  });
}

export async function updateTodo(id: number, dto: UpdateTodoDto) {
  return await request<Todo>(`todos/${id}`, undefined, {
    method: "PATCH",
    body: dto,
  });
}

export async function deleteTodo(id: number) {
  return await request<void>(`todos/${id}`, undefined, {
    method: "DELETE",
  });
}

export function useTodos({
  limit,
  skip,
  search,
}: { limit?: number; skip?: number; search?: string } = {}) {
  const queryKey = ["todos", { limit, skip, search }] as const;
  return useQuery({
    queryKey,
    queryFn: ({ queryKey: [, params] }) => getTodos(params),
  });
}

export function useTodo(id: number) {
  const queryKey = ["todos", id] as const;
  return useQuery({
    queryKey,
    queryFn: ({ queryKey: [, id] }) => getTodo(id),
  });
}

export function useUpdateTodo(id: number) {
  const mutationKey = ["todos", id] as const;
  return useMutation({
    mutationKey,
    mutationFn: (dto: UpdateTodoDto) => updateTodo(id, dto),
  });
}

export function useCreateTodo() {
  const mutationKey = ["todos/add"] as const;
  return useMutation({
    mutationKey,
    mutationFn: (dto: CreateTodoDto) => createTodo(dto),
  });
}

export function useDeleteTodo() {
  return useMutation({
    mutationFn: (id: number) => deleteTodo(id),
  });
}

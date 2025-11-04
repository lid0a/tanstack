import { queryOptions, useMutation } from "@tanstack/react-query";
import {
  createTodo,
  deleteTodo,
  getTodo,
  getTodos,
  updateTodo,
  type CreateTodoDto,
  type GetTodosParams,
  type UpdateTodoDto,
} from "~/api/todos";

export function getTodosQueryOptions(params: GetTodosParams = {}) {
  const queryKey = ["todos", params] as const;
  return queryOptions({
    queryKey,
    queryFn: ({ queryKey: [, params] }) => getTodos(params),
  });
}

export function getTodoQueryOptions(id: number) {
  const queryKey = ["todos", id] as const;
  return queryOptions({
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

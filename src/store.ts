import { Effect, Data } from 'effect';
import { randomUUIDv7 } from 'bun';
import type { Todo } from './types';

// In-memory store for todos
class TodoStore extends Data.TaggedClass('TodoStore')<{
  todos: Map<string, Todo>;
}> {}

export const makeTodoStore = Effect.succeed(
  new TodoStore({ todos: new Map() })
);

export const getTodos = Effect.gen(function* (_) {
  const store = yield* _(makeTodoStore);
  return Array.from(store.todos.values());
});

export const getTodoById = (id: string) =>
  Effect.gen(function* (_) {
    const store = yield* _(makeTodoStore);
    const todo = store.todos.get(id);
    if (!todo) {
      return Effect.fail(new Error(`Todo with id ${id} not found`));
    }
    return todo;
  });

export const createTodo = (todo: Omit<Todo, 'id'>) =>
  Effect.gen(function* (_) {
    const store = yield* _(makeTodoStore);
    const id = randomUUIDv7();
    const newTodo = { ...todo, id };
    store.todos.set(id, newTodo);
    return newTodo;
  });

export const updateTodo = (id: string, todo: Partial<Omit<Todo, 'id'>>) =>
  Effect.gen(function* (_) {
    const store = yield* _(makeTodoStore);
    const existing = store.todos.get(id);
    if (!existing) {
      return Effect.fail(new Error(`Todo with id ${id} not found`));
    }
    const updated = { ...existing, ...todo };
    store.todos.set(id, updated);
    return updated;
  });

export const deleteTodo = (id: string) =>
  Effect.gen(function* (_) {
    const store = yield* _(makeTodoStore);
    const deleted = store.todos.delete(id);
    if (!deleted) {
      return Effect.fail(new Error(`Todo with id ${id} not found`));
    }
    return true;
  });

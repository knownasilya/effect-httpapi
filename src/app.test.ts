import { test, expect, describe } from 'bun:test';
import { Effect } from 'effect';
import {
  getTodos,
  createTodo,
  getTodoById,
  updateTodo,
  deleteTodo,
} from './store';

describe('Todo CRUD operations', () => {
  test('should create and retrieve todos', async () => {
    const program = Effect.gen(function* (_) {
      const newTodo = yield* _(
        createTodo({
          title: 'Test Todo',
          completed: false,
        })
      );

      expect(newTodo).toHaveProperty('id');
      expect(newTodo.title).toBe('Test Todo');
      expect(newTodo.completed).toBe(false);

      const todos = yield* _(getTodos);
      expect(todos).toHaveLength(1);
      expect(todos[0]).toEqual(newTodo);

      const retrieved = yield* _(getTodoById(newTodo.id));
      expect(retrieved).toEqual(newTodo);
    });

    await Effect.runPromise(program);
  });

  test('should update a todo', async () => {
    const program = Effect.gen(function* (_) {
      const newTodo = yield* _(
        createTodo({
          title: 'Test Todo',
          completed: false,
        })
      );

      const updated = yield* _(
        updateTodo(newTodo.id, {
          completed: true,
        })
      );

      expect(updated.id).toBe(newTodo.id);
      expect(updated.title).toBe(newTodo.title);
      expect(updated.completed).toBe(true);
    });

    await Effect.runPromise(program);
  });

  test('should delete a todo', async () => {
    const program = Effect.gen(function* (_) {
      const newTodo = yield* _(
        createTodo({
          title: 'Test Todo',
          completed: false,
        })
      );

      yield* _(deleteTodo(newTodo.id));

      const todos = yield* _(getTodos);
      expect(todos).toHaveLength(0);

      const getTodoEffect = getTodoById(newTodo.id);
      expect(Effect.runSync(getTodoEffect)).rejects.toThrow();
    });

    await Effect.runPromise(program);
  });
});

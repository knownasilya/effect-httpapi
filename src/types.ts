import * as S from 'effect/Schema';

export const Todo = S.Struct({
  id: S.String,
  title: S.String,
  completed: S.Boolean,
});

export type Todo = typeof Todo.Type;

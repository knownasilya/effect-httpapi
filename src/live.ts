import { HttpApiBuilder } from '@effect/platform';
import { Api } from './app';

import { Todo } from './types';
import { Effect, Layer } from 'effect';
import { AuthService } from './auth';

const requireAuth = Effect.flatMap(AuthService, (service) =>
  Effect.flatMap(service.getUser(), (user) =>
    user === null
      ? Effect.fail({ error: 'Authentication required' })
      : Effect.succeed(user)
  )
);

export const TodosLive = HttpApiBuilder.group(Api, 'Todos', (handlers) =>
  handlers
    .handle('create-todo', ({ payload }) =>
      // Effect.flatMap(requireAuth, () =>
      //   Effect.catchAll(getTodos, (error) =>
      //     Effect.fail({ error: error.message })
      //   )
      // )
      Effect.succeed({ id: '1', title: 'a', completed: false })
    )
    .handle('get-todo', ({ path: { todoId } }) =>
      Effect.succeed({ id: '1', title: 'a', completed: false })
    )
    .handle('update-todo', ({ payload, path: { todoId } }) =>
      Effect.succeed({ id: todoId, title: 'Updated Todo', completed: true })
    )
    .handle('delete-todo', ({ path: { todoId } }) =>
      Effect.succeed(
        Todo.make({ id: todoId, title: 'Sample Todo', completed: false })
      )
    )
    .handle('get-todos', () =>
      Effect.succeed([
        Todo.make({ id: '1', title: 'Sample Todo 1', completed: false }),
        Todo.make({ id: '2', title: 'Sample Todo 2', completed: true }),
      ])
    )
);

export const AuthLive = HttpApiBuilder.group(Api, 'Auth', (handlers) =>
  handlers
    .handle('sign-up', ({ payload }) =>
      Effect.gen(function* () {
        const user = yield* Effect.flatMap(AuthService, (service) =>
          Effect.catchAll(service.signUp(payload), (error) =>
            Effect.fail({ error: error.message })
          )
        );
        return user;
      })
    )
    .handle('sign-in', ({ payload }) =>
      Effect.succeed({ id: '1', email: payload.email })
    )
    .handle('sign-out', () => Effect.succeed({}))
);

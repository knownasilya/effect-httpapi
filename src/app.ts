import { Effect, Layer } from 'effect';
import * as Schema from 'effect/Schema';

import { Todo } from './types';
import { AuthService, SignUpRequest, SignInRequest, User } from './auth';
import {
  HttpApi,
  HttpApiEndpoint,
  HttpApiGroup,
  HttpApiSchema,
} from '@effect/platform';

// Helper to check if user is authenticated

const authApiGroup = HttpApiGroup.make('Auth')
  .add(
    HttpApiEndpoint.post('sign-up')`/auth/signup`
      .setPayload(SignUpRequest)
      .addSuccess(User)
      .addError(Schema.Struct({ error: Schema.String }))
    // .implement((request) =>
    //   Effect.flatMap(AuthService, (service) =>
    //     Effect.catchAll(service.signUp(request), (error) =>
    //       Effect.fail({ error: error.message })
    //     )
    //   )
    // )
  )
  .add(
    HttpApiEndpoint.post('sign-in')`/auth/signin`
      .setPayload(SignInRequest)
      .addSuccess(User)
      .addError(Schema.Struct({ error: Schema.String }))
    // .implement((request) =>
    //   Effect.flatMap(AuthService, (service) =>
    //     Effect.catchAll(service.signIn(request), (error) =>
    //       Effect.fail({ error: error.message })
    //     )
    //   )
    // )
  )
  .add(
    HttpApiEndpoint.post('sign-out')`/auth/signout`
      .addSuccess(Schema.Void)
      .addError(Schema.Struct({ error: Schema.String }))
    // .implement(() =>
    //   Effect.flatMap(AuthService, (service) =>
    //     Effect.catchAll(service.signOut(), (error) =>
    //       Effect.fail({ error: error.message })
    //     )
    //   )
    // )
  );

const idParam = HttpApiSchema.param('todoId', Schema.String);

const todosApiGroup = HttpApiGroup.make('Todos')
  .add(
    HttpApiEndpoint.get('get-todos')`/todos`
      .addSuccess(Schema.Array(Todo))
      .addError(Schema.Struct({ error: Schema.String }))
    // .implement(() =>
    //   Effect.flatMap(requireAuth, () =>
    //     Effect.catchAll(getTodos, (error) =>
    //       Effect.fail({ error: error.message })
    //     )
    //   )
    // )
  )
  .add(
    HttpApiEndpoint.get('get-todo')`/todos/${idParam}`
      .addSuccess(Todo)
      .addError(Schema.Struct({ error: Schema.String }))
    // .implement(({ id }) =>
    //   Effect.flatMap(requireAuth, () =>
    //     Effect.catchAll(getTodoById(id), (error) =>
    //       Effect.fail({ error: error.message })
    //     )
    //   )
    // )
  )
  .add(
    HttpApiEndpoint.post('create-todo')`/todos`
      .setPayload(Todo.omit('id'))
      .addSuccess(Todo)
      .addError(Schema.Struct({ error: Schema.String }))
    // .implement((request) =>
    //   Effect.flatMap(requireAuth, () =>
    //     Effect.catchAll(createTodo(request), (error) =>
    //       Effect.fail({ error: error.message })
    //     )
    //   )
    // )
  )
  .add(
    HttpApiEndpoint.put('update-todo')`/todos/${idParam}`
      .setPayload(Schema.partial(Todo.omit('id')))
      .addSuccess(Todo)
      .addError(Schema.Struct({ error: Schema.String }))
    // .implement(({ id, request }) =>
    //   Effect.flatMap(requireAuth, () =>
    //     Effect.catchAll(updateTodo(id, request), (error) =>
    //       Effect.fail({ error: error.message })
    //     )
    //   )
    // )
  )
  .add(
    HttpApiEndpoint.del('delete-todo')`/todos/${idParam}`
      .addSuccess(Schema.Void)
      .addError(Schema.Struct({ error: Schema.String }))
    // .implement(({ id }) =>
    //   Effect.flatMap(requireAuth, () =>
    //     Effect.catchAll(deleteTodo(id), (error) =>
    //       Effect.fail({ error: error.message })
    //     )
    //   )
    // )
  );

export const Api = HttpApi.make('API').add(authApiGroup).add(todosApiGroup);
// const ApiLive = HttpApiBuilder.api(Api);

// export const server = HttpApiBuilder.serve().pipe(
//   Layer.provide(ApiLive),
//   Layer.provide(BunHttpServer.layer({ port: 3000 }))
// );

// Launch the server

import { Effect, Context, Data, Config } from 'effect';
import { createClient } from '@supabase/supabase-js';
import * as Schema from 'effect/Schema';
import { config } from './config';

// Auth types
export const User = Schema.Struct({
  id: Schema.String,
  email: Schema.String,
});
export type User = typeof User.Type;

export const SignUpRequest = Schema.Struct({
  email: Schema.String,
  password: Schema.String,
});
export type SignUpRequest = typeof SignUpRequest.Type;

export const SignInRequest = Schema.Struct({
  email: Schema.String,
  password: Schema.String,
});
export type SignInRequest = typeof SignInRequest.Type;

// Auth service interface
export class AuthError extends Data.TaggedError('AuthError')<{
  message: string;
}> {}

export class AuthService extends Effect.Service<AuthService>()('AuthService', {
  effect: Effect.gen(function* () {
    const conf = yield* config;
    const url = conf.SUPABASE_URL;
    const key = conf.SUPABASE_ANON_KEY;
    const supabase = createClient(url, key);

    return {
      signUp: (request) =>
        Effect.tryPromise({
          try: async () => {
            const { data, error } = await supabase.auth.signUp(request);
            if (error) throw new AuthError({ message: error.message });
            if (!data.user)
              throw new AuthError({ message: 'No user returned' });
            return { id: data.user.id, email: data.user.email! };
          },
          catch: (error) => new AuthError({ message: String(error) }),
        }),

      signIn: (request) =>
        Effect.tryPromise({
          try: async () => {
            const { data, error } = await supabase.auth.signInWithPassword(
              request
            );
            if (error) throw new AuthError({ message: error.message });
            if (!data.user)
              throw new AuthError({ message: 'No user returned' });
            return { id: data.user.id, email: data.user.email! };
          },
          catch: (error) => new AuthError({ message: String(error) }),
        }),

      signOut: () =>
        Effect.tryPromise({
          try: async () => {
            const { error } = await supabase.auth.signOut();
            if (error) throw new AuthError({ message: error.message });
          },
          catch: (error) => new AuthError({ message: String(error) }),
        }),

      getUser: () =>
        Effect.tryPromise({
          try: async () => {
            const {
              data: { user },
              error,
            } = await supabase.auth.getUser();
            if (error) throw new AuthError({ message: error.message });
            return user ? { id: user.id, email: user.email! } : null;
          },
          catch: (error) => new AuthError({ message: String(error) }),
        }),
    } as const;
  }),
}) {}

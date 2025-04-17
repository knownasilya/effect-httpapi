import { Config, Effect, Layer } from 'effect';
import { BunHttpServer, BunRuntime } from '@effect/platform-bun';
import { Api } from './app';
import { AuthService } from './auth';
import { HttpApiBuilder, HttpApiSwagger } from '@effect/platform';
import { AuthLive, TodosLive } from './live';
import { config } from './config';

const MyApiLive = HttpApiBuilder.api(Api)
  .pipe(Layer.provide(AuthLive))
  .pipe(Layer.provide(TodosLive))
  .pipe(Layer.provide(AuthService.Default));

// Set up the server using NodeHttpServer on port 3000
const ServerLive = HttpApiBuilder.serve().pipe(
  Layer.provide(MyApiLive),

  Layer.provide(HttpApiSwagger.layer()),
  Layer.provide(BunHttpServer.layer({ port: 3000 }))
);

// Launch the server
Layer.launch(ServerLive).pipe(BunRuntime.runMain);

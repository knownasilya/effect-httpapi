import { Config } from 'effect';

export const config = Config.all({
  SUPABASE_URL: Config.string('SUPABASE_URL'),
  SUPABASE_ANON_KEY: Config.string('SUPABASE_ANON_KEY'),
});

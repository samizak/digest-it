import { router } from '../trpc';
import { redditRouter } from './reddit';

export const appRouter = router({
  reddit: redditRouter,
});

export type AppRouter = typeof appRouter;
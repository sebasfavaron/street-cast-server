import { router } from '../trpc';
import { advertisersRouter } from './advertisers';
import { campaignsRouter } from './campaigns';
import { devicesRouter } from './devices';
import { creativesRouter } from './creatives';
import { analyticsRouter } from './analytics';

export const appRouter = router({
  advertisers: advertisersRouter,
  campaigns: campaignsRouter,
  devices: devicesRouter,
  creatives: creativesRouter,
  analytics: analyticsRouter,
});

// Export the router type for use in the client
export type AppRouter = typeof appRouter;

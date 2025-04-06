import { initTRPC } from '@trpc/server';
import { z } from 'zod';

// Create context type
export const createTRPCContext = async () => {
  return {};
};

// Initialize tRPC
const t = initTRPC.context<typeof createTRPCContext>().create();

// Export reusable router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;
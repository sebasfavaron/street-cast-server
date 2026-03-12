import { initTRPC } from '@trpc/server';
import { prisma } from '../../lib/prisma';

// Context type
export interface Context {
  prisma: typeof prisma;
}

// Initialize tRPC with context
const t = initTRPC.context<Context>().create();

// Base router and procedure helpers
export const router = t.router;
export const procedure = t.procedure;

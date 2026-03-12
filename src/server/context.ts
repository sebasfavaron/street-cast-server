import { prisma } from '../../lib/prisma';

export interface Context {
  prisma: typeof prisma;
}

export const createContext = (): Context => ({
  prisma,
});

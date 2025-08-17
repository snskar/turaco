import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobalClient: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  globalThis.prismaGlobalClient ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobalClient = prisma;
}

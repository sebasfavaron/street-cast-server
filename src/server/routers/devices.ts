import { z } from 'zod';
import { router, procedure } from '../trpc';
import type { DeviceWithImpressions } from '@/types';

export const devicesRouter = router({
  getAll: procedure.query(async ({ ctx }) => {
    const devices = await ctx.prisma.device.findMany({
      include: {
        impressions: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return devices.map((device) => ({
      ...device,
      createdAt: device.createdAt.toISOString(),
      lastSeen: device.lastSeen?.toISOString() || null,
    })) as DeviceWithImpressions[];
  }),

  create: procedure
    .input(
      z.object({
        name: z.string().min(1, 'Name is required'),
        location: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const device = await ctx.prisma.device.create({
        data: {
          name: input.name,
          location: input.location || null,
        },
      });

      return device;
    }),
});

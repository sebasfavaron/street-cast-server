import { z } from 'zod';
import { router, procedure } from '../trpc';
import type { AdvertiserWithCampaigns } from '@/types';

export const advertisersRouter = router({
  getAll: procedure.query(async ({ ctx }) => {
    const advertisers = await ctx.prisma.advertiser.findMany({
      include: {
        campaigns: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return advertisers.map((advertiser) => ({
      ...advertiser,
      createdAt: advertiser.createdAt.toISOString(),
    })) as AdvertiserWithCampaigns[];
  }),

  create: procedure
    .input(
      z.object({
        name: z.string().min(1, 'Name is required'),
        contactInfo: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const advertiser = await ctx.prisma.advertiser.create({
        data: {
          name: input.name,
          contactInfo: input.contactInfo || null,
        },
      });

      return advertiser;
    }),
});

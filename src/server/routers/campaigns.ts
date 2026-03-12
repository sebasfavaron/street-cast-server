import { z } from 'zod';
import { router, procedure } from '../trpc';
import type { CampaignWithDetails } from '@/types';

export const campaignsRouter = router({
  getAll: procedure.query(async ({ ctx }) => {
    const campaigns = await ctx.prisma.campaign.findMany({
      include: {
        advertiser: {
          select: {
            id: true,
            name: true,
          },
        },
        creatives: {
          select: {
            id: true,
            url: true,
            duration: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return campaigns as CampaignWithDetails[];
  }),

  create: procedure
    .input(
      z.object({
        name: z.string().min(1, 'Name is required'),
        advertiserId: z.string().min(1, 'Advertiser ID is required'),
        startAt: z.string().min(1, 'Start date is required'),
        endAt: z.string().min(1, 'End date is required'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify advertiser exists
      const advertiser = await ctx.prisma.advertiser.findUnique({
        where: { id: input.advertiserId },
      });

      if (!advertiser) {
        throw new Error('Advertiser not found');
      }

      const campaign = await ctx.prisma.campaign.create({
        data: {
          name: input.name,
          advertiserId: input.advertiserId,
          startAt: new Date(input.startAt),
          endAt: new Date(input.endAt),
        },
        include: {
          advertiser: {
            select: {
              id: true,
              name: true,
            },
          },
          creatives: true,
        },
      });

      return campaign as CampaignWithDetails;
    }),
});

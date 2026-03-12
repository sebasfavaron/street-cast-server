import { z } from 'zod';
import { router, procedure } from '../trpc';
import type { Creative } from '@/types';

export const creativesRouter = router({
  getAll: procedure.query(async ({ ctx }) => {
    const creatives = await ctx.prisma.creative.findMany({
      include: {
        campaign: {
          include: {
            advertiser: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return creatives as Creative[];
  }),

  create: procedure
    .input(
      z.object({
        campaignId: z.string().min(1, 'Campaign ID is required'),
        url: z.string().url('Valid URL is required'),
        duration: z
          .union([z.string(), z.number()])
          .transform((val) => (typeof val === 'string' ? parseInt(val) : val)),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify campaign exists
      const campaign = await ctx.prisma.campaign.findUnique({
        where: { id: input.campaignId },
      });

      if (!campaign) {
        throw new Error('Campaign not found');
      }

      const creative = await ctx.prisma.creative.create({
        data: {
          campaignId: input.campaignId,
          url: input.url,
          duration: input.duration,
        },
        include: {
          campaign: {
            include: {
              advertiser: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      return creative as Creative;
    }),

  delete: procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if creative exists
      const creative = await ctx.prisma.creative.findUnique({
        where: { id: input.id },
      });

      if (!creative) {
        throw new Error('Creative not found');
      }

      // Delete the creative
      await ctx.prisma.creative.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});

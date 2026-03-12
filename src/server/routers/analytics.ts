import { router, procedure } from '../trpc';
import type { AnalyticsData } from '@/types';

export const analyticsRouter = router({
  getData: procedure.query(async ({ ctx }) => {
    // Get total impressions count
    const totalImpressions = await ctx.prisma.impression.count();

    // Get impressions with campaign and device data
    const impressions = await ctx.prisma.impression.findMany({
      include: {
        creative: {
          include: {
            campaign: {
              include: {
                advertiser: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        device: {
          select: {
            name: true,
            location: true,
          },
        },
      },
    });

    // Group by campaign
    const campaignGroups = new Map<
      string,
      {
        campaignName: string;
        advertiserName: string;
        count: number;
      }
    >();
    impressions.forEach((impression) => {
      const key = impression.creative.campaign.id;
      if (!campaignGroups.has(key)) {
        campaignGroups.set(key, {
          campaignName: impression.creative.campaign.name,
          advertiserName: impression.creative.campaign.advertiser.name,
          count: 0,
        });
      }
      const group = campaignGroups.get(key);
      if (group) {
        group.count++;
      }
    });
    const impressionsByCampaign = Array.from(campaignGroups.values());

    // Group by device
    const deviceGroups = new Map<
      string,
      {
        deviceName: string;
        location: string | null;
        count: number;
      }
    >();
    impressions.forEach((impression) => {
      const key = impression.deviceId;
      if (!deviceGroups.has(key)) {
        deviceGroups.set(key, {
          deviceName: impression.device.name,
          location: impression.device.location,
          count: 0,
        });
      }
      const group = deviceGroups.get(key);
      if (group) {
        group.count++;
      }
    });
    const impressionsByDevice = Array.from(deviceGroups.values());

    // Get recent impressions (last 50)
    const recentImpressions = await ctx.prisma.impression.findMany({
      take: 50,
      orderBy: {
        shownAt: 'desc',
      },
      include: {
        device: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
        creative: {
          include: {
            campaign: {
              include: {
                advertiser: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const analyticsData: AnalyticsData = {
      totalImpressions,
      impressionsByCampaign,
      impressionsByDevice,
      recentImpressions: recentImpressions.map((impression) => ({
        ...impression,
        shownAt: impression.shownAt.toISOString(),
        creative: {
          ...impression.creative,
          createdAt: impression.creative.createdAt.toISOString(),
          campaign: {
            ...impression.creative.campaign,
            createdAt: impression.creative.campaign.createdAt.toISOString(),
            startAt: impression.creative.campaign.startAt.toISOString(),
            endAt: impression.creative.campaign.endAt.toISOString(),
          },
        },
      })),
    };

    return analyticsData;
  }),
});

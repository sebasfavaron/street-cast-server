import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get total impressions count
    const totalImpressions = await prisma.impression.count();

    // Get impressions with campaign and device data
    const impressions = await prisma.impression.findMany({
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
    const recentImpressions = await prisma.impression.findMany({
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

    // Data is already transformed above

    const analyticsData = {
      totalImpressions,
      impressionsByCampaign,
      impressionsByDevice,
      recentImpressions,
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

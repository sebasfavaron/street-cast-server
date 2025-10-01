import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { CreativeCreateRequest } from '@/types';

export async function GET() {
  try {
    const creatives = await prisma.creative.findMany({
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

    return NextResponse.json(creatives);
  } catch (error) {
    console.error('Error fetching creatives:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreativeCreateRequest;
    const { campaignId, url, duration } = body;

    if (!campaignId || !url || !duration) {
      return NextResponse.json(
        { error: 'campaignId, url, and duration are required' },
        { status: 400 }
      );
    }

    // Verify campaign exists
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    const creative = await prisma.creative.create({
      data: {
        campaignId,
        url,
        duration: typeof duration === 'string' ? parseInt(duration) : duration,
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

    return NextResponse.json(creative, { status: 201 });
  } catch (error) {
    console.error('Error creating creative:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

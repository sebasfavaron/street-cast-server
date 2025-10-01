import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { CampaignCreateRequest } from '@/types';

export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
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

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CampaignCreateRequest;
    const { name, advertiserId, startAt, endAt } = body;

    if (!name || !advertiserId || !startAt || !endAt) {
      return NextResponse.json(
        { error: 'Name, advertiserId, startAt, and endAt are required' },
        { status: 400 }
      );
    }

    // Verify advertiser exists
    const advertiser = await prisma.advertiser.findUnique({
      where: { id: advertiserId },
    });

    if (!advertiser) {
      return NextResponse.json(
        { error: 'Advertiser not found' },
        { status: 404 }
      );
    }

    const campaign = await prisma.campaign.create({
      data: {
        name,
        advertiserId,
        startAt: new Date(startAt),
        endAt: new Date(endAt),
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

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { AdvertiserCreateRequest } from '@/types';

export async function GET() {
  try {
    const advertisers = await prisma.advertiser.findMany({
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

    return NextResponse.json(advertisers);
  } catch (error) {
    console.error('Error fetching advertisers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AdvertiserCreateRequest;
    const { name, contactInfo } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const advertiser = await prisma.advertiser.create({
      data: {
        name,
        contactInfo: contactInfo || null,
      },
    });

    return NextResponse.json(advertiser, { status: 201 });
  } catch (error) {
    console.error('Error creating advertiser:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

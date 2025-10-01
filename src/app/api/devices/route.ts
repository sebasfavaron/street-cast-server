import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { DeviceCreateRequest } from '@/types';

export async function GET() {
  try {
    const devices = await prisma.device.findMany({
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

    return NextResponse.json(devices);
  } catch (error) {
    console.error('Error fetching devices:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as DeviceCreateRequest;
    const { name, location } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const device = await prisma.device.create({
      data: {
        name,
        location: location || null,
      },
    });

    return NextResponse.json(device, { status: 201 });
  } catch (error) {
    console.error('Error creating device:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

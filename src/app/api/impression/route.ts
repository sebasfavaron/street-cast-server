import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deviceId, creativeId } = body;

    if (!deviceId || !creativeId) {
      return NextResponse.json(
        { error: 'deviceId and creativeId are required' },
        { status: 400 }
      );
    }

    // Verify device exists
    const device = await prisma.device.findUnique({
      where: { id: deviceId },
    });

    if (!device) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }

    // Verify creative exists
    const creative = await prisma.creative.findUnique({
      where: { id: creativeId },
    });

    if (!creative) {
      return NextResponse.json(
        { error: 'Creative not found' },
        { status: 404 }
      );
    }

    // Record the impression
    const impression = await prisma.impression.create({
      data: {
        deviceId,
        creativeId,
        shownAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      impressionId: impression.id,
    });
  } catch (error) {
    console.error('Error recording impression:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

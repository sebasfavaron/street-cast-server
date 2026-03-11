import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import type { ImpressionCreateRequest } from '@/types';
import { applyCors, createCorsPreflightResponse } from '../../../lib/cors';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ImpressionCreateRequest;
    const { deviceId, creativeId } = body;

    if (!deviceId || !creativeId) {
      return applyCors(
        NextResponse.json(
          { error: 'deviceId and creativeId are required' },
          { status: 400 }
        ),
        request
      );
    }

    // Verify device exists
    const device = await prisma.device.findUnique({
      where: { id: deviceId },
    });

    if (!device) {
      return applyCors(
        NextResponse.json({ error: 'Device not found' }, { status: 404 }),
        request
      );
    }

    // Verify creative exists
    const creative = await prisma.creative.findUnique({
      where: { id: creativeId },
    });

    if (!creative) {
      return applyCors(
        NextResponse.json(
          { error: 'Creative not found' },
          { status: 404 }
        ),
        request
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

    return applyCors(
      NextResponse.json({
        success: true,
        impressionId: impression.id,
      }),
      request
    );
  } catch (error) {
    console.error('Error recording impression:', error);
    return applyCors(
      NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      ),
      request
    );
  }
}

export function OPTIONS(request: NextRequest) {
  return createCorsPreflightResponse(request);
}

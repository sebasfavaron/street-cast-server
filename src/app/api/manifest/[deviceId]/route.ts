import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get base URL for constructing full creative URLs
const getBaseUrl = (request: NextRequest) => {
  const protocol = request.headers.get('x-forwarded-proto') || 'http';
  const host = request.headers.get('host');

  if (!host) {
    throw new Error(
      'Host header not found in request. This is required for proper URL construction.'
    );
  }

  return `${protocol}://${host}`;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ deviceId: string }> }
) {
  try {
    const { deviceId } = await params;
    const baseUrl = getBaseUrl(request);

    // Find the device
    const device = await prisma.device.findUnique({
      where: { id: deviceId },
    });

    if (!device) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }

    // Update last seen timestamp
    await prisma.device.update({
      where: { id: deviceId },
      data: { lastSeen: new Date() },
    });

    // Get active campaigns with their creatives
    const now = new Date();
    const campaigns = await prisma.campaign.findMany({
      where: {
        startAt: { lte: now },
        endAt: { gte: now },
      },
      include: {
        creatives: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Flatten all creatives from active campaigns
    const creatives = campaigns.flatMap((campaign) =>
      campaign.creatives.map((creative) => {
        // Construct full URL using base URL
        const fullUrl = creative.url.startsWith('http')
          ? creative.url
          : `${baseUrl}${creative.url.startsWith('/') ? '' : '/'}${
              creative.url
            }`;

        return {
          id: creative.id,
          url: fullUrl,
          duration: creative.duration,
          campaignId: campaign.id,
          campaignName: campaign.name,
        };
      })
    );

    const manifest = {
      version: Date.now().toString(),
      deviceId,
      creatives,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(manifest);
  } catch (error) {
    console.error('Error generating manifest:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

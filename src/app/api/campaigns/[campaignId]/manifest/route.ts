import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { applyCors, createCorsPreflightResponse } from '@/lib/cors';
import type { Creative as PrismaCreative } from '@prisma/client';

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
  { params }: { params: Promise<{ campaignId: string }> }
) {
  try {
    const { campaignId } = await params;
    const baseUrl = getBaseUrl(request);

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { creatives: true },
    });

    if (!campaign) {
      return applyCors(
        NextResponse.json({ error: 'Campaign not found' }, { status: 404 }),
        request
      );
    }

    const creatives = campaign.creatives.map((creative: PrismaCreative) => ({
      id: creative.id,
      url: creative.url.startsWith('http')
        ? creative.url
        : `${baseUrl}${creative.url.startsWith('/') ? '' : '/'}${creative.url}`,
      duration: creative.duration,
      campaignId: campaign.id,
      campaignName: campaign.name,
    }));

    return applyCors(
      NextResponse.json({
        preview: true,
        campaignId: campaign.id,
        campaignName: campaign.name,
        creatives,
        generatedAt: new Date().toISOString(),
      }),
      request
    );
  } catch (error) {
    console.error('Error generating campaign manifest preview:', error);
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

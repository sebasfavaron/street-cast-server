// Standard Next.js + Prisma type definitions
// This is the conventional approach used by most Next.js + Prisma projects

import type { Prisma } from '@prisma/client';

// Base types from Prisma (these are automatically generated)
export type {
  Advertiser,
  Campaign,
  Creative,
  Device,
  Impression,
} from '@prisma/client';

// Extended types for specific use cases
// This is the standard pattern in the Next.js + Prisma community

export type CampaignWithDetails = Prisma.CampaignGetPayload<{
  include: {
    advertiser: { select: { id: true; name: true } };
    creatives: { select: { id: true; url: true; duration: true } };
  };
}>;

export type AdvertiserWithCampaigns = {
  id: string;
  name: string;
  contactInfo: string | null;
  createdAt: string;
  campaigns: { id: string; name: string }[];
};

export type DeviceWithImpressions = {
  id: string;
  name: string;
  location: string | null;
  createdAt: string;
  lastSeen: string | null;
  impressions: { id: string }[];
};

export type ImpressionWithDetails = {
  id: string;
  deviceId: string;
  creativeId: string;
  shownAt: string;
  device: { id: string; name: string; location: string | null };
  creative: {
    id: string;
    createdAt: string;
    campaignId: string;
    url: string;
    duration: number;
    campaign: {
      id: string;
      name: string;
      createdAt: string;
      advertiserId: string;
      startAt: string;
      endAt: string;
      advertiser: { name: string };
    };
  };
};

// Analytics response type
export type AnalyticsData = {
  totalImpressions: number;
  impressionsByCampaign: Array<{
    campaignName: string;
    advertiserName: string;
    count: number;
  }>;
  impressionsByDevice: Array<{
    deviceName: string;
    location: string | null;
    count: number;
  }>;
  recentImpressions: ImpressionWithDetails[];
};

// API Request Body Types
// Standard naming pattern: {Entity}CreateRequest for POST body types

export type AdvertiserCreateRequest = {
  name: string;
  contactInfo?: string;
};

export type CampaignCreateRequest = {
  name: string;
  advertiserId: string;
  startAt: string;
  endAt: string;
};

export type CreativeCreateRequest = {
  campaignId: string;
  url: string;
  duration: string | number;
};

export type DeviceCreateRequest = {
  name: string;
  location?: string;
};

export type ImpressionCreateRequest = {
  deviceId: string;
  creativeId: string;
};

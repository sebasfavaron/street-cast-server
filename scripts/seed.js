#!/usr/bin/env node

/**
 * Development Seed Script
 * This script populates the database with sample data for development
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with development data...');

  try {
    // Create sample advertiser
    const advertiser = await prisma.advertiser.upsert({
      where: { id: 'dev-advertiser-1' },
      update: {},
      create: {
        id: 'dev-advertiser-1',
        name: 'Tennis Ball Co.',
        contactInfo: 'contact@tennisballco.com',
      },
    });

    console.log('✅ Created advertiser:', advertiser.name);

    // Create sample campaign
    const campaign = await prisma.campaign.upsert({
      where: { id: 'dev-campaign-1' },
      update: {},
      create: {
        id: 'dev-campaign-1',
        advertiserId: advertiser.id,
        name: 'Summer Tennis Campaign',
        startAt: new Date('2024-01-01'),
        endAt: new Date('2024-12-31'),
      },
    });

    console.log('✅ Created campaign:', campaign.name);

    // Create sample creatives
    const creatives = [
      {
        id: 'dev-creative-1',
        campaignId: campaign.id,
        url: '/videos/sample-ad-1.mp4',
        duration: 15,
      },
      {
        id: 'dev-creative-2',
        campaignId: campaign.id,
        url: '/videos/sample-ad-2.mp4',
        duration: 20,
      },
    ];

    for (const creativeData of creatives) {
      const creative = await prisma.creative.upsert({
        where: { id: creativeData.id },
        update: {},
        create: creativeData,
      });
      console.log('✅ Created creative:', creative.url);
    }

    // Create sample device
    const device = await prisma.device.upsert({
      where: { id: 'dev-device-1' },
      update: {},
      create: {
        id: 'dev-device-1',
        name: 'Tennis Court Display #1',
        location: 'Central Park Tennis Courts',
        lastSeen: new Date(),
      },
    });

    console.log('✅ Created device:', device.name);

    // Create sample impressions
    const impressions = [
      {
        deviceId: device.id,
        creativeId: 'dev-creative-1',
        shownAt: new Date(Date.now() - 3600000), // 1 hour ago
      },
      {
        deviceId: device.id,
        creativeId: 'dev-creative-2',
        shownAt: new Date(Date.now() - 1800000), // 30 minutes ago
      },
    ];

    for (const impressionData of impressions) {
      await prisma.impression.create({
        data: impressionData,
      });
    }

    console.log('✅ Created sample impressions');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\nYou can now:');
    console.log(
      `- Visit http://localhost:${
        process.env.PORT || 3050
      } to see the admin dashboard`
    );
    console.log('- Test the manifest API: GET /api/manifest/dev-device-1');
    console.log('- View analytics: GET /api/analytics');
    console.log('- Open Prisma Studio: npm run db:studio');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

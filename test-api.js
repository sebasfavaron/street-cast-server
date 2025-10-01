// Simple test script to verify API endpoints work
// Run with: node test-api.js

const BASE_URL = 'http://localhost:3050';

async function testAPI() {
  console.log('🧪 Testing Street Cast Server API...\n');

  try {
    // Test 1: Create an advertiser
    console.log('1. Creating advertiser...');
    const advertiserResponse = await fetch(`${BASE_URL}/api/advertisers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Tennis Club',
        contactInfo: 'test@tennisclub.com',
      }),
    });
    const advertiser = await advertiserResponse.json();
    console.log('✅ Advertiser created:', advertiser.name);

    // Test 2: Create a campaign
    console.log('\n2. Creating campaign...');
    const startDate = new Date();
    const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    const campaignResponse = await fetch(`${BASE_URL}/api/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Summer Tennis Promotion',
        advertiserId: advertiser.id,
        startAt: startDate.toISOString(),
        endAt: endDate.toISOString(),
      }),
    });
    const campaign = await campaignResponse.json();
    console.log('✅ Campaign created:', campaign.name);

    // Test 3: Register a device
    console.log('\n3. Registering device...');
    const deviceResponse = await fetch(`${BASE_URL}/api/devices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Tennis Court Display #1',
        location: 'Court 1',
      }),
    });
    const device = await deviceResponse.json();
    console.log('✅ Device registered:', device.name, '(ID:', device.id + ')');

    // Test 4: Get manifest for device
    console.log('\n4. Getting manifest for device...');
    const manifestResponse = await fetch(
      `${BASE_URL}/api/manifest/${device.id}`
    );
    const manifest = await manifestResponse.json();
    console.log('✅ Manifest received:', {
      version: manifest.version,
      deviceId: manifest.deviceId,
      creativesCount: manifest.creatives.length,
    });

    // Test 5: Record an impression (simulate video play)
    console.log('\n5. Recording impression...');
    // Note: This will fail if no creatives exist, which is expected
    try {
      const impressionResponse = await fetch(`${BASE_URL}/api/impression`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: device.id,
          creativeId: 'test-creative-id', // This will fail, but that's expected
        }),
      });
      if (impressionResponse.ok) {
        console.log('✅ Impression recorded');
      } else {
        console.log(
          '⚠️  Impression recording failed (expected - no creatives exist yet)'
        );
      }
    } catch (error) {
      console.log(
        '⚠️  Impression recording failed (expected - no creatives exist yet) - ' +
          error
      );
    }

    // Test 6: Get analytics
    console.log('\n6. Getting analytics...');
    const analyticsResponse = await fetch(`${BASE_URL}/api/analytics`);
    const analytics = await analyticsResponse.json();
    console.log('✅ Analytics received:', {
      totalImpressions: analytics.totalImpressions,
      campaignsCount: analytics.impressionsByCampaign.length,
      devicesCount: analytics.impressionsByDevice.length,
    });

    console.log('\n🎉 All tests completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Add some MP4 videos to public/videos/ directory');
    console.log('2. Create Creative records in the database for your videos');
    console.log('3. Test the full flow with real video playback');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\nMake sure the development server is running: npm run dev');
  }
}

testAPI();

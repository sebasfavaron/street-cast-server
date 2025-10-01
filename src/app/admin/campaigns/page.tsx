'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { CampaignWithDetails, AdvertiserWithCampaigns } from '@/types';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignWithDetails[]>([]);
  const [advertisers, setAdvertisers] = useState<AdvertiserWithCampaigns[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showCreativeForm, setShowCreativeForm] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    advertiserId: '',
    startAt: '',
    endAt: '',
  });
  const [creativeFormData, setCreativeFormData] = useState({
    url: '',
    duration: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [campaignsRes, advertisersRes] = await Promise.all([
        fetch('/api/campaigns'),
        fetch('/api/advertisers'),
      ]);

      const campaignsData =
        (await campaignsRes.json()) as CampaignWithDetails[];
      const advertisersData =
        (await advertisersRes.json()) as AdvertiserWithCampaigns[];

      setCampaigns(campaignsData);
      setAdvertisers(advertisersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: '', advertiserId: '', startAt: '', endAt: '' });
        setShowForm(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  const handleCreativeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/creatives', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaignId: selectedCampaignId,
          ...creativeFormData,
        }),
      });

      if (response.ok) {
        setCreativeFormData({ url: '', duration: '' });
        setShowCreativeForm(false);
        setSelectedCampaignId('');
        fetchData();
      }
    } catch (error) {
      console.error('Error creating creative:', error);
    }
  };

  const handleDeleteCreative = async (creativeId: string) => {
    if (!confirm('Are you sure you want to delete this creative?')) return;

    try {
      const response = await fetch(`/api/creatives/${creativeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting creative:', error);
    }
  };

  const openCreativeForm = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setShowCreativeForm(true);
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600'></div>
          <p className='mt-4 text-gray-600'>Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>Campaigns</h1>
              <p className='mt-2 text-gray-600'>
                Manage your advertising campaigns
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className='bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors'
            >
              Create Campaign
            </button>
          </div>
        </div>

        {showForm && (
          <div className='mb-8 bg-white p-6 rounded-lg shadow'>
            <h2 className='text-xl font-semibold mb-4'>Create New Campaign</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-800'
                >
                  Campaign Name
                </label>
                <input
                  type='text'
                  id='name'
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-600'
                />
              </div>
              <div>
                <label
                  htmlFor='advertiserId'
                  className='block text-sm font-medium text-gray-800'
                >
                  Advertiser
                </label>
                <select
                  id='advertiserId'
                  required
                  value={formData.advertiserId}
                  onChange={(e) =>
                    setFormData({ ...formData, advertiserId: e.target.value })
                  }
                  className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-600'
                >
                  <option value=''>Select an advertiser</option>
                  {advertisers.map((advertiser) => (
                    <option key={advertiser.id} value={advertiser.id}>
                      {advertiser.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='startAt'
                    className='block text-sm font-medium text-gray-800'
                  >
                    Start Date
                  </label>
                  <input
                    type='datetime-local'
                    id='startAt'
                    required
                    value={formData.startAt}
                    onChange={(e) =>
                      setFormData({ ...formData, startAt: e.target.value })
                    }
                    className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-600'
                  />
                </div>
                <div>
                  <label
                    htmlFor='endAt'
                    className='block text-sm font-medium text-gray-800'
                  >
                    End Date
                  </label>
                  <input
                    type='datetime-local'
                    id='endAt'
                    required
                    value={formData.endAt}
                    onChange={(e) =>
                      setFormData({ ...formData, endAt: e.target.value })
                    }
                    className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-600'
                  />
                </div>
              </div>
              <div className='flex gap-2'>
                <button
                  type='submit'
                  className='bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors'
                >
                  Create Campaign
                </button>
                <button
                  type='button'
                  onClick={() => setShowForm(false)}
                  className='bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {showCreativeForm && (
          <div className='mb-8 bg-white p-6 rounded-lg shadow'>
            <h2 className='text-xl font-semibold mb-4'>
              Add Creative to Campaign
            </h2>
            <form onSubmit={handleCreativeSubmit} className='space-y-4'>
              <div>
                <label
                  htmlFor='url'
                  className='block text-sm font-medium text-gray-800'
                >
                  Video URL
                </label>
                <input
                  type='url'
                  id='url'
                  required
                  value={creativeFormData.url}
                  onChange={(e) =>
                    setCreativeFormData({
                      ...creativeFormData,
                      url: e.target.value,
                    })
                  }
                  className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-600'
                  placeholder='https://yourserver.com/videos/ad1.mp4'
                />
                <p className='mt-1 text-sm text-gray-600'>
                  Place MP4 files in /public/videos/ and use:
                  /videos/filename.mp4
                </p>
              </div>
              <div>
                <label
                  htmlFor='duration'
                  className='block text-sm font-medium text-gray-800'
                >
                  Duration (seconds)
                </label>
                <input
                  type='number'
                  id='duration'
                  required
                  min='1'
                  value={creativeFormData.duration}
                  onChange={(e) =>
                    setCreativeFormData({
                      ...creativeFormData,
                      duration: e.target.value,
                    })
                  }
                  className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-600'
                  placeholder='30'
                />
              </div>
              <div className='flex gap-2'>
                <button
                  type='submit'
                  className='bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors'
                >
                  Add Creative
                </button>
                <button
                  type='button'
                  onClick={() => {
                    setShowCreativeForm(false);
                    setSelectedCampaignId('');
                  }}
                  className='bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className='bg-white shadow rounded-lg'>
          {campaigns.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-gray-600'>
                No campaigns found. Create your first campaign to get started.
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                      Name
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                      Advertiser
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                      Duration
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                      Creatives
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {campaigns.map((campaign) => {
                    const now = new Date();
                    const startAt = new Date(campaign.startAt);
                    const endAt = new Date(campaign.endAt);
                    const isActive = now >= startAt && now <= endAt;
                    const isUpcoming = now < startAt;
                    // const isExpired = now > endAt;

                    return (
                      <tr key={campaign.id} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                          {campaign.name}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                          {campaign.advertiser.name}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                          {startAt.toLocaleDateString()} -{' '}
                          {endAt.toLocaleDateString()}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                          <div className='space-y-1'>
                            <div className='font-medium'>
                              {campaign.creatives.length} videos
                            </div>
                            {campaign.creatives.length > 0 && (
                              <div className='text-xs text-gray-500 space-y-1'>
                                {campaign.creatives
                                  .slice(0, 2)
                                  .map((creative) => (
                                    <div
                                      key={creative.id}
                                      className='flex items-center justify-between'
                                    >
                                      <span
                                        className='truncate max-w-32'
                                        title={creative.url}
                                      >
                                        {creative.url.split('/').pop()}
                                      </span>
                                      <span className='text-gray-400'>
                                        {creative.duration}s
                                      </span>
                                    </div>
                                  ))}
                                {campaign.creatives.length > 2 && (
                                  <div className='text-gray-400'>
                                    +{campaign.creatives.length - 2} more
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              isActive
                                ? 'bg-green-100 text-green-800'
                                : isUpcoming
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {isActive
                              ? 'Active'
                              : isUpcoming
                              ? 'Upcoming'
                              : 'Expired'}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                          <div className='flex space-x-2'>
                            <button
                              onClick={() => openCreativeForm(campaign.id)}
                              className='text-indigo-600 hover:text-indigo-900'
                            >
                              Add Creative
                            </button>
                            {campaign.creatives.length > 0 && (
                              <button
                                onClick={() => {
                                  // Toggle creative details view
                                  const details = document.getElementById(
                                    `creatives-${campaign.id}`
                                  );
                                  if (details) {
                                    details.style.display =
                                      details.style.display === 'none'
                                        ? 'block'
                                        : 'none';
                                  }
                                }}
                                className='text-gray-600 hover:text-gray-900'
                              >
                                View Creatives
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Creative Details Modal/Expanded View */}
        {campaigns.map(
          (campaign) =>
            campaign.creatives.length > 0 && (
              <div
                key={`creatives-${campaign.id}`}
                id={`creatives-${campaign.id}`}
                style={{ display: 'none' }}
                className='mt-4 bg-white p-6 rounded-lg shadow'
              >
                <div className='space-y-3'>
                  <h4 className='font-medium text-gray-900'>
                    Campaign Creatives: {campaign.name}
                  </h4>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                    {campaign.creatives.map((creative) => (
                      <div
                        key={creative.id}
                        className='bg-gray-50 p-3 rounded border'
                      >
                        <div className='flex items-center justify-between mb-2'>
                          <span className='text-sm font-medium text-gray-900'>
                            {creative.url.split('/').pop()}
                          </span>
                          <button
                            onClick={() => handleDeleteCreative(creative.id)}
                            className='text-red-600 hover:text-red-800 text-xs'
                          >
                            Delete
                          </button>
                        </div>
                        <div className='text-xs text-gray-600 space-y-1'>
                          <div>Duration: {creative.duration}s</div>
                          <div className='truncate' title={creative.url}>
                            URL: {creative.url}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
        )}

        <div className='mt-8'>
          <Link
            href='/'
            className='text-indigo-600 hover:text-indigo-500 font-medium'
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

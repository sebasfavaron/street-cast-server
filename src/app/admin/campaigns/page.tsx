'use client';

import Link from 'next/link';
import { resolveAppUrl } from '../../../lib/app-url';
import { trpc } from '@/lib/trpc';
import { CampaignForm } from './campaign-form';
import { CreativeForm } from './creative-form';
import { CreativeDeleteButton } from './creative-delete-button';

// Get base URL from environment variable
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return resolveAppUrl();
};

export default function CampaignsPage() {
  const { data: campaigns, isLoading: campaignsLoading } =
    trpc.campaigns.getAll.useQuery();
  const { data: advertisers, isLoading: advertisersLoading } =
    trpc.advertisers.getAll.useQuery();

  const isLoading = campaignsLoading || advertisersLoading;

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>Campaigns</h1>
              <p className='mt-2 text-gray-600'>
                Manage your advertising campaigns and creative content.
              </p>
            </div>
            <CampaignForm advertisers={advertisers || []} />
          </div>
        </div>

        {/* Campaign Status Summary */}
        {campaigns && campaigns.length > 0 && (
          <div className='mb-6 grid grid-cols-1 md:grid-cols-4 gap-4'>
            {(() => {
              const now = new Date();
              const activeCount = campaigns?.filter((c) => {
                const startAt = new Date(c.startAt);
                const endAt = new Date(c.endAt);
                return now >= startAt && now <= endAt;
              }).length;
              const upcomingCount = campaigns?.filter((c) => {
                const startAt = new Date(c.startAt);
                return now < startAt;
              }).length;
              const expiredCount = campaigns?.filter((c) => {
                const endAt = new Date(c.endAt);
                return now > endAt;
              }).length;

              return (
                <>
                  <div className='bg-white p-4 rounded-lg shadow'>
                    <div className='text-2xl font-bold text-green-600'>
                      {activeCount}
                    </div>
                    <div className='text-sm text-gray-700'>
                      Active Campaigns
                    </div>
                  </div>
                  <div className='bg-white p-4 rounded-lg shadow'>
                    <div className='text-2xl font-bold text-blue-600'>
                      {upcomingCount}
                    </div>
                    <div className='text-sm text-gray-700'>
                      Upcoming Campaigns
                    </div>
                  </div>
                  <div className='bg-white p-4 rounded-lg shadow'>
                    <div className='text-2xl font-bold text-red-600'>
                      {expiredCount}
                    </div>
                    <div className='text-sm text-gray-700'>
                      Expired Campaigns
                    </div>
                  </div>
                  <div className='bg-gray-50 p-4 rounded-lg'>
                    <div className='text-2xl font-bold text-gray-600'>
                      {campaigns?.length}
                    </div>
                    <div className='text-sm text-gray-700'>Total Campaigns</div>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        <div className='bg-white shadow rounded-lg'>
          {isLoading ? (
            <div className='text-center py-12'>
              <p className='text-gray-600'>Loading campaigns...</p>
            </div>
          ) : campaigns?.length === 0 ? (
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
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Campaign
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Advertiser
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Duration
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Creatives
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {campaigns?.map((campaign) => {
                    const now = new Date();
                    const startAt = new Date(campaign.startAt);
                    const endAt = new Date(campaign.endAt);
                    const isActive = now >= startAt && now <= endAt;
                    const isUpcoming = now < startAt;
                    const isExpired = now > endAt;

                    let statusColor = 'bg-gray-100 text-gray-800';
                    let statusText = 'Unknown';

                    if (isActive) {
                      statusColor = 'bg-green-100 text-green-800';
                      statusText = 'Active';
                    } else if (isUpcoming) {
                      statusColor = 'bg-blue-100 text-blue-800';
                      statusText = 'Upcoming';
                    } else if (isExpired) {
                      statusColor = 'bg-red-100 text-red-800';
                      statusText = 'Expired';
                    }

                    return (
                      <tr key={campaign.id} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm font-medium text-gray-900'>
                            {campaign.name}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                          {campaign.advertiser.name}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColor}`}
                          >
                            {statusText}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                          {startAt.toLocaleDateString()} -{' '}
                          {endAt.toLocaleDateString()}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                          {campaign.creatives.length}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                          <CreativeForm campaignId={campaign.id} />
                          <a
                            href={`${getBaseUrl()}/api/campaigns/${campaign.id}/manifest`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-green-600 hover:text-green-500 ml-3'
                          >
                            Preview Manifest
                          </a>
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
        {campaigns?.map(
          (campaign) =>
            campaign.creatives.length > 0 && (
              <div
                key={`creatives-${campaign.id}`}
                id={`creatives-${campaign.id}`}
                className='mt-6 bg-white shadow rounded-lg'
              >
                <div className='px-4 py-5 sm:p-6'>
                  <h3 className='text-lg leading-6 font-medium text-gray-900 mb-4'>
                    Creatives for {campaign.name}
                  </h3>
                  <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Video URL
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Duration
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className='bg-white divide-y divide-gray-200'>
                        {campaign.creatives.map((creative) => (
                          <tr key={creative.id} className='hover:bg-gray-50'>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                              <a
                                href={creative.url}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-indigo-600 hover:text-indigo-500 break-all'
                              >
                                {creative.url}
                              </a>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                              {creative.duration}s
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                              <CreativeDeleteButton creativeId={creative.id} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )
        )}

        {/* Navigation */}
        <div className='mt-8 flex justify-between'>
          <Link
            href='/admin/advertisers'
            className='text-indigo-600 hover:text-indigo-500 font-medium'
          >
            ← Back to Advertisers
          </Link>
          <Link
            href='/admin/devices'
            className='text-indigo-600 hover:text-indigo-500 font-medium'
          >
            View Devices →
          </Link>
        </div>
      </div>
    </div>
  );
}

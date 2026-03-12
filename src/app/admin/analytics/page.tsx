'use client';

import Link from 'next/link';
import { trpc } from '@/lib/trpc';
import { ExportButton } from './export-button';

export default function AnalyticsPage() {
  const { data, isLoading } = trpc.analytics.getData.useQuery();

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>Analytics</h1>
              <p className='mt-2 text-gray-600'>
                Track performance and insights across all your campaigns.
              </p>
            </div>
            <ExportButton data={data} />
          </div>
        </div>

        {/* Summary Cards */}
        {isLoading ? (
          <div className='text-center py-12'>
            <p className='text-gray-600'>Loading analytics data...</p>
          </div>
        ) : (
          <>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
              <div className='bg-white overflow-hidden shadow rounded-lg'>
                <div className='p-5'>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0'>
                      <div className='w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center'>
                        <svg
                          className='w-5 h-5 text-white'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                          />
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                          />
                        </svg>
                      </div>
                    </div>
                    <div className='ml-5 w-0 flex-1'>
                      <dl>
                        <dt className='text-sm font-medium text-gray-500 truncate'>
                          Total Impressions
                        </dt>
                        <dd className='text-lg font-medium text-gray-900'>
                          {data?.totalImpressions.toLocaleString() || 0}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className='bg-white overflow-hidden shadow rounded-lg'>
                <div className='p-5'>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0'>
                      <div className='w-8 h-8 bg-green-500 rounded-md flex items-center justify-center'>
                        <svg
                          className='w-5 h-5 text-white'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                          />
                        </svg>
                      </div>
                    </div>
                    <div className='ml-5 w-0 flex-1'>
                      <dl>
                        <dt className='text-sm font-medium text-gray-500 truncate'>
                          Active Campaigns
                        </dt>
                        <dd className='text-lg font-medium text-gray-900'>
                          {data?.impressionsByCampaign.length || 0}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className='bg-white overflow-hidden shadow rounded-lg'>
                <div className='p-5'>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0'>
                      <div className='w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center'>
                        <svg
                          className='w-5 h-5 text-white'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                          />
                        </svg>
                      </div>
                    </div>
                    <div className='ml-5 w-0 flex-1'>
                      <dl>
                        <dt className='text-sm font-medium text-gray-500 truncate'>
                          Connected Devices
                        </dt>
                        <dd className='text-lg font-medium text-gray-900'>
                          {data?.impressionsByDevice.length || 0}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Campaign Performance */}
            <div className='bg-white shadow rounded-lg mb-8'>
              <div className='px-4 py-5 sm:p-6'>
                <h3 className='text-lg leading-6 font-medium text-gray-900 mb-4'>
                  Campaign Performance
                </h3>
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
                          Impressions
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {data?.impressionsByCampaign.map((item, index) => (
                        <tr key={index} className='hover:bg-gray-50'>
                          <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                            {item.campaignName}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                            {item.advertiserName}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                            {item.count.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Device Performance */}
            <div className='bg-white shadow rounded-lg mb-8'>
              <div className='px-4 py-5 sm:p-6'>
                <h3 className='text-lg leading-6 font-medium text-gray-900 mb-4'>
                  Device Performance
                </h3>
                <div className='overflow-x-auto'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Device
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Location
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Impressions
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {data?.impressionsByDevice.map((item, index) => (
                        <tr key={index} className='hover:bg-gray-50'>
                          <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                            {item.deviceName}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                            {item.location || 'N/A'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                            {item.count.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Recent Impressions */}
            <div className='bg-white shadow rounded-lg'>
              <div className='px-4 py-5 sm:p-6'>
                <h3 className='text-lg leading-6 font-medium text-gray-900 mb-4'>
                  Recent Impressions
                </h3>
                <div className='overflow-x-auto'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Device
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Campaign
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Advertiser
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Timestamp
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {data?.recentImpressions.map((impression) => (
                        <tr key={impression.id} className='hover:bg-gray-50'>
                          <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                            {impression.device.name}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                            {impression.creative.campaign.name}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                            {impression.creative.campaign.advertiser.name}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                            {new Date(impression.shownAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Navigation */}
        <div className='mt-8 flex justify-between'>
          <Link
            href='/admin/devices'
            className='text-indigo-600 hover:text-indigo-500 font-medium'
          >
            ← Back to Devices
          </Link>
          <Link
            href='/admin/campaigns'
            className='text-indigo-600 hover:text-indigo-500 font-medium'
          >
            View Campaigns →
          </Link>
        </div>
      </div>
    </div>
  );
}

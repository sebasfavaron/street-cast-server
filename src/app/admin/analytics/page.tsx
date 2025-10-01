'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { AnalyticsData } from '@/types';

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      const analyticsData = (await response.json()) as AnalyticsData;
      setData(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!data) return;

    const csvContent = [
      ['Campaign', 'Advertiser', 'Impressions'].join(','),
      ...data.impressionsByCampaign.map((item) =>
        [`"${item.campaignName}"`, `"${item.advertiserName}"`, item.count].join(
          ','
        )
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `impressions-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600'></div>
          <p className='mt-4 text-gray-600'>Loading analytics...</p>
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
              <h1 className='text-3xl font-bold text-gray-900'>Analytics</h1>
              <p className='mt-2 text-gray-600'>
                View campaign performance and impressions
              </p>
            </div>
            <button
              onClick={exportCSV}
              className='bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors'
            >
              Export CSV
            </button>
          </div>
        </div>

        {data && (
          <>
            {/* Summary Cards */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
              <div className='bg-white p-6 rounded-lg shadow'>
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
                  <div className='ml-4'>
                    <p className='text-sm font-medium text-gray-600'>
                      Total Impressions
                    </p>
                    <p className='text-2xl font-semibold text-gray-900'>
                      {data.totalImpressions}
                    </p>
                  </div>
                </div>
              </div>

              <div className='bg-white p-6 rounded-lg shadow'>
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
                  <div className='ml-4'>
                    <p className='text-sm font-medium text-gray-600'>
                      Active Campaigns
                    </p>
                    <p className='text-2xl font-semibold text-gray-900'>
                      {data.impressionsByCampaign.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className='bg-white p-6 rounded-lg shadow'>
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
                  <div className='ml-4'>
                    <p className='text-sm font-medium text-gray-600'>
                      Active Devices
                    </p>
                    <p className='text-2xl font-semibold text-gray-900'>
                      {data.impressionsByDevice.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Campaign Performance */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
              <div className='bg-white p-6 rounded-lg shadow'>
                <h3 className='text-lg font-medium text-gray-900 mb-4'>
                  Impressions by Campaign
                </h3>
                {data.impressionsByCampaign.length === 0 ? (
                  <p className='text-gray-600'>No impressions recorded yet.</p>
                ) : (
                  <div className='space-y-3'>
                    {data.impressionsByCampaign.map((item, index) => (
                      <div
                        key={index}
                        className='flex justify-between items-center'
                      >
                        <div>
                          <p className='text-sm font-medium text-gray-900'>
                            {item.campaignName}
                          </p>
                          <p className='text-xs text-gray-600'>
                            {item.advertiserName}
                          </p>
                        </div>
                        <span className='text-sm font-semibold text-indigo-600'>
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className='bg-white p-6 rounded-lg shadow'>
                <h3 className='text-lg font-medium text-gray-900 mb-4'>
                  Impressions by Device
                </h3>
                {data.impressionsByDevice.length === 0 ? (
                  <p className='text-gray-600'>No impressions recorded yet.</p>
                ) : (
                  <div className='space-y-3'>
                    {data.impressionsByDevice.map((item, index) => (
                      <div
                        key={index}
                        className='flex justify-between items-center'
                      >
                        <div>
                          <p className='text-sm font-medium text-gray-900'>
                            {item.deviceName}
                          </p>
                          {item.location && (
                            <p className='text-xs text-gray-600'>
                              {item.location}
                            </p>
                          )}
                        </div>
                        <span className='text-sm font-semibold text-indigo-600'>
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Impressions */}
            <div className='bg-white shadow rounded-lg'>
              <div className='px-6 py-4 border-b border-gray-200'>
                <h3 className='text-lg font-medium text-gray-900'>
                  Recent Impressions
                </h3>
              </div>
              {data.recentImpressions.length === 0 ? (
                <div className='text-center py-12'>
                  <p className='text-gray-600'>
                    No recent impressions to display.
                  </p>
                </div>
              ) : (
                <div className='overflow-x-auto'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                          Time
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                          Device
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                          Campaign
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                          Advertiser
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {data.recentImpressions.map((impression) => (
                        <tr key={impression.id} className='hover:bg-gray-50'>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                            {new Date(impression.shownAt).toLocaleString()}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                            {impression.device.name}
                            {impression.device.location && (
                              <span className='text-gray-500'>
                                {' '}
                                - {impression.device.location}
                              </span>
                            )}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                            {impression.creative.campaign.name}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                            {impression.creative.campaign.advertiser.name}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
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

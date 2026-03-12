'use client';

import Link from 'next/link';
import { trpc } from '@/lib/trpc';
import { AdvertiserForm } from './advertiser-form';

export default function AdvertisersPage() {
  const {
    data: advertisers,
    isLoading,
    error,
  } = trpc.advertisers.getAll.useQuery();

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-600 text-lg'>Error loading advertisers</p>
          <p className='text-gray-600 mt-2'>{error.message}</p>
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
              <h1 className='text-3xl font-bold text-gray-900'>Advertisers</h1>
              <p className='mt-2 text-gray-600'>
                Manage your advertising partners and their campaigns.
              </p>
            </div>
            <AdvertiserForm />
          </div>
        </div>

        <div className='bg-white shadow rounded-lg'>
          {isLoading ? (
            <div className='text-center py-12'>
              <p className='text-gray-600'>Loading advertisers...</p>
            </div>
          ) : advertisers?.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-gray-600'>
                No advertisers found. Create your first advertiser to get
                started.
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Name
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Contact Info
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Campaigns
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {advertisers?.map((advertiser) => (
                    <tr key={advertiser.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {advertiser.name}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                        {advertiser.contactInfo || 'N/A'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                        {advertiser.campaigns.length}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                        {new Date(advertiser.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className='mt-8 flex justify-between'>
          <Link
            href='/admin/campaigns'
            className='text-indigo-600 hover:text-indigo-500 font-medium'
          >
            ← Back to Campaigns
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

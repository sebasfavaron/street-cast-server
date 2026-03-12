'use client';

import Link from 'next/link';
import { trpc } from '@/lib/trpc';
import { DeviceForm } from './device-form';

export default function DevicesPage() {
  const { data: devices, isLoading } = trpc.devices.getAll.useQuery();

  const getDeviceStatus = (lastSeen?: string | null) => {
    if (!lastSeen)
      return { status: 'offline', color: 'bg-red-100 text-red-800' };

    const lastSeenDate = new Date(lastSeen);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastSeenDate.getTime()) / (1000 * 60);

    if (diffMinutes < 5) {
      return { status: 'online', color: 'bg-green-100 text-green-800' };
    } else if (diffMinutes < 30) {
      return { status: 'warning', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { status: 'offline', color: 'bg-red-100 text-red-800' };
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>Devices</h1>
              <p className='mt-2 text-gray-600'>
                Manage and monitor your connected displays.
              </p>
            </div>
            <DeviceForm />
          </div>
        </div>

        <div className='bg-white shadow rounded-lg'>
          {isLoading ? (
            <div className='text-center py-12'>
              <p className='text-gray-600'>Loading devices...</p>
            </div>
          ) : devices?.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-gray-600'>
                No devices registered. Register your first device to get
                started.
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Device Name
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Location
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Impressions
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Last Seen
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Device ID
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {devices?.map((device) => {
                    const deviceStatus = getDeviceStatus(device.lastSeen);
                    return (
                      <tr key={device.id} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                          {device.name}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                          {device.location || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${deviceStatus.color}`}
                          >
                            {deviceStatus.status}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                          {device.impressions.length}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                          {device.lastSeen
                            ? new Date(device.lastSeen).toLocaleString()
                            : 'Never'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500'>
                          {device.id}
                        </td>
                      </tr>
                    );
                  })}
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
            href='/admin/analytics'
            className='text-indigo-600 hover:text-indigo-500 font-medium'
          >
            View Analytics →
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Device {
  id: string;
  name: string;
  location?: string;
  lastSeen?: string;
  createdAt: string;
  impressions: { id: string }[];
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
  });

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await fetch('/api/devices');
      const data = await response.json();
      setDevices(data);
    } catch (error) {
      console.error('Error fetching devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: '', location: '' });
        setShowForm(false);
        fetchDevices();
      }
    } catch (error) {
      console.error('Error creating device:', error);
    }
  };

  const getDeviceStatus = (lastSeen?: string) => {
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

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600'></div>
          <p className='mt-4 text-gray-600'>Loading devices...</p>
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
              <h1 className='text-3xl font-bold text-gray-900'>Devices</h1>
              <p className='mt-2 text-gray-600'>
                Manage connected displays and screens
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className='bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors'
            >
              Register Device
            </button>
          </div>
        </div>

        {showForm && (
          <div className='mb-8 bg-white p-6 rounded-lg shadow'>
            <h2 className='text-xl font-semibold mb-4'>Register New Device</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-800'
                >
                  Device Name
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
                  placeholder='e.g., Tennis Court Display #1'
                />
              </div>
              <div>
                <label
                  htmlFor='location'
                  className='block text-sm font-medium text-gray-800'
                >
                  Location (Optional)
                </label>
                <input
                  type='text'
                  id='location'
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-600'
                  placeholder='e.g., Court 1, Main Entrance'
                />
              </div>
              <div className='flex gap-2'>
                <button
                  type='submit'
                  className='bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors'
                >
                  Register Device
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

        <div className='bg-white shadow rounded-lg'>
          {devices.length === 0 ? (
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
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                      Name
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                      Location
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                      Last Seen
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                      Impressions
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                      Device ID
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {devices.map((device) => {
                    const deviceStatus = getDeviceStatus(device.lastSeen);
                    return (
                      <tr key={device.id} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                          {device.name}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                          {device.location || 'No location set'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${deviceStatus.color}`}
                          >
                            {deviceStatus.status}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                          {device.lastSeen
                            ? new Date(device.lastSeen).toLocaleString()
                            : 'Never'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                          {device.impressions.length}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono'>
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

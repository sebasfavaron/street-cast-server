'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc';

export function DeviceForm() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
  });

  const utils = trpc.useUtils();
  const createDeviceMutation = trpc.devices.create.useMutation({
    onSuccess: () => {
      setFormData({ name: '', location: '' });
      setShowForm(false);
      // Invalidate and refetch devices
      utils.devices.getAll.invalidate();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDeviceMutation.mutateAsync(formData);
    } catch (error) {
      console.error('Error creating device:', error);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className='bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
      >
        Register Device
      </button>

      {/* Register Device Form */}
      {showForm && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
          <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
            <div className='mt-3'>
              <h2 className='text-lg font-medium text-gray-900 mb-4'>
                Register New Device
              </h2>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-700'
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
                    className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                    placeholder='Enter device name'
                  />
                </div>
                <div>
                  <label
                    htmlFor='location'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Location
                  </label>
                  <input
                    type='text'
                    id='location'
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                    placeholder='Enter device location'
                  />
                </div>
                <div className='flex justify-end space-x-3'>
                  <button
                    type='button'
                    onClick={() => setShowForm(false)}
                    className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    disabled={createDeviceMutation.isPending}
                    className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {createDeviceMutation.isPending
                      ? 'Registering...'
                      : 'Register Device'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

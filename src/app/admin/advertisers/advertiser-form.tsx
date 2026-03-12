'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc';

export function AdvertiserForm() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactInfo: '',
  });

  const utils = trpc.useUtils();
  const createAdvertiserMutation = trpc.advertisers.create.useMutation({
    onSuccess: () => {
      setFormData({ name: '', contactInfo: '' });
      setShowForm(false);
      // Invalidate and refetch advertisers
      utils.advertisers.getAll.invalidate();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAdvertiserMutation.mutateAsync(formData);
    } catch (error) {
      console.error('Error creating advertiser:', error);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className='bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
      >
        Add Advertiser
      </button>

      {/* Add Advertiser Form */}
      {showForm && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
          <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
            <div className='mt-3'>
              <h2 className='text-lg font-medium text-gray-900 mb-4'>
                Add New Advertiser
              </h2>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Advertiser Name
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
                    placeholder='Enter advertiser name'
                  />
                </div>
                <div>
                  <label
                    htmlFor='contactInfo'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Contact Information
                  </label>
                  <textarea
                    id='contactInfo'
                    value={formData.contactInfo}
                    onChange={(e) =>
                      setFormData({ ...formData, contactInfo: e.target.value })
                    }
                    rows={3}
                    className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                    placeholder='Enter contact information'
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
                    disabled={createAdvertiserMutation.isPending}
                    className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {createAdvertiserMutation.isPending
                      ? 'Adding...'
                      : 'Add Advertiser'}
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

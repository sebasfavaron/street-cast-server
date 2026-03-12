'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc';

interface CreativeFormProps {
  campaignId: string;
}

export function CreativeForm({ campaignId }: CreativeFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    url: '',
    duration: '',
  });

  const utils = trpc.useUtils();
  const createCreativeMutation = trpc.creatives.create.useMutation({
    onSuccess: () => {
      setFormData({ url: '', duration: '' });
      setShowForm(false);
      // Invalidate and refetch campaigns to update creative counts
      utils.campaigns.getAll.invalidate();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCreativeMutation.mutateAsync({
        campaignId,
        ...formData,
      });
    } catch (error) {
      console.error('Error creating creative:', error);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className='text-indigo-600 hover:text-indigo-500'
      >
        Add Creative
      </button>

      {/* Add Creative Form */}
      {showForm && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
          <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
            <div className='mt-3'>
              <h2 className='text-lg font-medium text-gray-900 mb-4'>
                Add Creative to Campaign
              </h2>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='grid grid-cols-1 gap-4'>
                  <div>
                    <label
                      htmlFor='url'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Video URL
                    </label>
                    <input
                      type='url'
                      id='url'
                      required
                      value={formData.url}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          url: e.target.value,
                        })
                      }
                      className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                      placeholder='https://example.com/video.mp4'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='duration'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Duration (seconds)
                    </label>
                    <input
                      type='number'
                      id='duration'
                      required
                      min='1'
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          duration: e.target.value,
                        })
                      }
                      className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                      placeholder='30'
                    />
                  </div>
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
                    disabled={createCreativeMutation.isPending}
                    className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {createCreativeMutation.isPending
                      ? 'Adding...'
                      : 'Add Creative'}
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

'use client';

import { useRef, useState } from 'react';
import { trpc } from '@/lib/trpc';
import type { AdvertiserWithCampaigns } from '@/types';

interface CampaignFormProps {
  advertisers: AdvertiserWithCampaigns[];
}

export function CampaignForm({ advertisers }: CampaignFormProps) {
  const [showForm, setShowForm] = useState(false);
  const isSubmittingRef = useRef(false);
  const [formData, setFormData] = useState({
    name: '',
    advertiserId: '',
    startAt: '',
    endAt: '',
  });

  const utils = trpc.useUtils();
  const createCampaignMutation = trpc.campaigns.create.useMutation({
    onSuccess: () => {
      setFormData({ name: '', advertiserId: '', startAt: '', endAt: '' });
      setShowForm(false);
      isSubmittingRef.current = false;
      // Invalidate and refetch campaigns
      utils.campaigns.getAll.invalidate();
    },
    onError: () => {
      isSubmittingRef.current = false;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current || createCampaignMutation.isPending) {
      return;
    }

    isSubmittingRef.current = true;

    try {
      await createCampaignMutation.mutateAsync(formData);
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className='bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
      >
        Create Campaign
      </button>

      {/* Create Campaign Form */}
      {showForm && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
          <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
            <div className='mt-3'>
              <h2 className='text-lg font-medium text-gray-900 mb-4'>
                Create New Campaign
              </h2>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='grid grid-cols-1 gap-4'>
                  <div>
                    <label
                      htmlFor='name'
                      className='block text-sm font-medium text-gray-700'
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
                      className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                      placeholder='Enter campaign name'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='advertiserId'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Advertiser
                    </label>
                    <select
                      id='advertiserId'
                      required
                      value={formData.advertiserId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          advertiserId: e.target.value,
                        })
                      }
                      className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-600'
                    >
                      <option value=''>Select an advertiser</option>
                      {advertisers?.map((advertiser) => (
                        <option key={advertiser.id} value={advertiser.id}>
                          {advertiser.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor='startAt'
                      className='block text-sm font-medium text-gray-700'
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
                      className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='endAt'
                      className='block text-sm font-medium text-gray-700'
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
                      className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
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
                    disabled={createCampaignMutation.isPending}
                    className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {createCampaignMutation.isPending
                      ? 'Creating...'
                      : 'Create Campaign'}
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

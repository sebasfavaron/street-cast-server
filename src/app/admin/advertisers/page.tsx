'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { AdvertiserWithCampaigns } from '@/types';

export default function AdvertisersPage() {
  const [advertisers, setAdvertisers] = useState<AdvertiserWithCampaigns[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactInfo: '',
  });

  useEffect(() => {
    fetchAdvertisers();
  }, []);

  const fetchAdvertisers = async () => {
    try {
      const response = await fetch('/api/advertisers');
      const data = (await response.json()) as AdvertiserWithCampaigns[];
      setAdvertisers(data);
    } catch (error) {
      console.error('Error fetching advertisers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/advertisers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: '', contactInfo: '' });
        setShowForm(false);
        fetchAdvertisers();
      }
    } catch (error) {
      console.error('Error creating advertiser:', error);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600'></div>
          <p className='mt-4 text-gray-600'>Loading advertisers...</p>
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
                Manage your advertising clients
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className='bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors'
            >
              Add Advertiser
            </button>
          </div>
        </div>

        {showForm && (
          <div className='mb-8 bg-white p-6 rounded-lg shadow'>
            <h2 className='text-xl font-semibold mb-4'>Add New Advertiser</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-800'
                >
                  Name
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
                />
              </div>
              <div>
                <label
                  htmlFor='contactInfo'
                  className='block text-sm font-medium text-gray-800'
                >
                  Contact Information
                </label>
                <input
                  type='text'
                  id='contactInfo'
                  value={formData.contactInfo}
                  onChange={(e) =>
                    setFormData({ ...formData, contactInfo: e.target.value })
                  }
                  className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-600'
                />
              </div>
              <div className='flex gap-2'>
                <button
                  type='submit'
                  className='bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors'
                >
                  Create Advertiser
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
          {advertisers.length === 0 ? (
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
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                      Name
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                      Contact Info
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                      Campaigns
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {advertisers.map((advertiser) => (
                    <tr key={advertiser.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {advertiser.name}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                        {advertiser.contactInfo || 'No contact info'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                        {advertiser.campaigns.length} campaigns
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

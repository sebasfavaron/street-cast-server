import Link from 'next/link';

export default function Home() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='py-12'>
          <div className='text-center'>
            <h1 className='text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl'>
              Street Cast Server
            </h1>
            <p className='mt-3 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl'>
              Manage advertising campaigns for connected displays
            </p>
          </div>

          <div className='mt-10'>
            <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
              <Link
                href='/admin/advertisers'
                className='relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg shadow hover:shadow-md transition-shadow'
              >
                <div>
                  <span className='rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white'>
                    <svg
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                      />
                    </svg>
                  </span>
                </div>
                <div className='mt-8'>
                  <h3 className='text-lg font-medium'>
                    <span className='absolute inset-0' aria-hidden='true' />
                    Advertisers
                  </h3>
                  <p className='mt-2 text-sm text-gray-500'>
                    Manage advertisers and their contact information
                  </p>
                </div>
              </Link>

              <Link
                href='/admin/campaigns'
                className='relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg shadow hover:shadow-md transition-shadow'
              >
                <div>
                  <span className='rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white'>
                    <svg
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                      />
                    </svg>
                  </span>
                </div>
                <div className='mt-8'>
                  <h3 className='text-lg font-medium'>
                    <span className='absolute inset-0' aria-hidden='true' />
                    Campaigns
                  </h3>
                  <p className='mt-2 text-sm text-gray-500'>
                    Create and manage advertising campaigns
                  </p>
                </div>
              </Link>

              <Link
                href='/admin/devices'
                className='relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg shadow hover:shadow-md transition-shadow'
              >
                <div>
                  <span className='rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white'>
                    <svg
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                      />
                    </svg>
                  </span>
                </div>
                <div className='mt-8'>
                  <h3 className='text-lg font-medium'>
                    <span className='absolute inset-0' aria-hidden='true' />
                    Devices
                  </h3>
                  <p className='mt-2 text-sm text-gray-500'>
                    Register and manage connected displays
                  </p>
                </div>
              </Link>

              <Link
                href='/admin/analytics'
                className='relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg shadow hover:shadow-md transition-shadow'
              >
                <div>
                  <span className='rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white'>
                    <svg
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                      />
                    </svg>
                  </span>
                </div>
                <div className='mt-8'>
                  <h3 className='text-lg font-medium'>
                    <span className='absolute inset-0' aria-hidden='true' />
                    Analytics
                  </h3>
                  <p className='mt-2 text-sm text-gray-500'>
                    View impressions and campaign performance
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

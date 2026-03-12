'use client';

import type { AnalyticsData } from '@/types';

interface ExportButtonProps {
  data: AnalyticsData | undefined;
}

export function ExportButton({ data }: ExportButtonProps) {
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

  return (
    <button
      onClick={exportCSV}
      disabled={!data}
      className='bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
    >
      Export CSV
    </button>
  );
}

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Street Cast Server - Digital Advertising Management',
  description:
    'Manage advertising campaigns on connected displays with our comprehensive platform. Create campaigns, track impressions, and monitor analytics for tennis ball vending machines and other digital displays.',
  keywords: [
    'digital advertising',
    'outdoor advertising',
    'connected displays',
    'campaign management',
    'impression tracking',
    'analytics',
    'tennis ball vending machines',
  ],
  authors: [{ name: 'Street Cast Team' }],
  creator: 'Street Cast',
  publisher: 'Street Cast',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3050'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Street Cast Server - Digital Advertising Management',
    description:
      'Manage advertising campaigns on connected displays with our comprehensive platform. Create campaigns, track impressions, and monitor analytics for tennis ball vending machines and other digital displays.',
    url: '/',
    siteName: 'Street Cast Server',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Street Cast Server - Digital Advertising Management Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Street Cast Server - Digital Advertising Management',
    description:
      'Manage advertising campaigns on connected displays with our comprehensive platform. Create campaigns, track impressions, and monitor analytics.',
    images: ['/og-image.svg'],
    creator: '@streetcast',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  manifest: '/manifest.json',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Street Cast Server',
    'application-name': 'Street Cast Server',
    'msapplication-TileColor': '#667eea',
    'theme-color': '#667eea',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Street Cast Server',
    description:
      'Digital Advertising Management Platform for Connected Displays',
    url: 'http://localhost:3050',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Organization',
      name: 'Street Cast',
    },
    featureList: [
      'Campaign Management',
      'Impression Tracking',
      'Analytics Dashboard',
      'Device Management',
      'Advertiser Management',
    ],
  };

  return (
    <html lang='en'>
      <head>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

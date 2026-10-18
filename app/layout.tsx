import type { Metadata, Viewport } from 'next';
import { content } from '../src/content';
import { siteDescription, siteUrl } from '../src/lib/site';
import '../src/styles.css';

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: '7amdi',
    template: '%s | 7amdi',
  },
  description: siteDescription,
  keywords: ['7amdi', 'personal website', 'Bluesky', 'top artists', 'Last.fm'],
  authors: [{ name: content.name, url: siteUrl }],
  creator: content.name,
  publisher: content.name,
  applicationName: '7amdi',
  category: 'personal',
  referrer: 'strict-origin-when-cross-origin',
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: siteUrl.toString() },
  openGraph: {
    type: 'website',
    url: siteUrl.toString(),
    siteName: '7amdi',
    title: '7amdi',
    description: siteDescription,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: '7amdi',
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export const viewport: Viewport = { themeColor: '#0a0e2a' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': new URL('#website', siteUrl).toString(),
        name: content.name,
        url: siteUrl.toString(),
        description: siteDescription,
        inLanguage: 'en',
        publisher: { '@id': new URL('#person', siteUrl).toString() },
      },
      {
        '@type': 'Person',
        '@id': new URL('#person', siteUrl).toString(),
        name: content.name,
        url: siteUrl.toString(),
        sameAs: [
          `https://bsky.app/profile/${content.bluesky}`,
          `https://www.last.fm/user/${content.lastfm.user}`,
        ],
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/instrument-serif-italic-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/koft-arabic-regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: "try{if(localStorage.getItem('7amdi-theme')==='blue')document.documentElement.dataset.theme='blue'}catch{}",
          }}
        />
      </head>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
          }}
        />
      </body>
    </html>
  );
}

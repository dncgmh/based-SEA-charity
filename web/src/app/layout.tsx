import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from '../config';

import './global.css';
import '@coinbase/onchainkit/styles.css';
import '@rainbow-me/rainbowkit/styles.css';
import dynamic from 'next/dynamic';
import { Toaster } from 'sonner';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Providers } from '@/components/providers';

const OnchainProviders = dynamic(() => import('@/components/OnchainProviders'), {
  ssr: false,
});

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title: 'Based SEA Charity',
  description: 'Blockchain-based fundraising platform for charities in South East Asia',
  openGraph: {
    title: 'Based SEA Charity',
    description: 'Empowering South East Asian charities through blockchain fundraising',
    images: [`${NEXT_PUBLIC_URL}/based-sea-charity-logo.png`],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <Providers>
          <OnchainProviders>
            <NavBar />
            {children}
            <Footer />
          </OnchainProviders>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import NotFoundPage from '../src/components/NotFoundPage';

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'This page does not exist on 7amdi.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundPage />;
}

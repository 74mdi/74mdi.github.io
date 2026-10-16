import { generateSiteImage, imageSize } from '../src/lib/og-image';

export const runtime = 'nodejs';
export const alt = '7amdi’s personal site: Bluesky posts and top artists on a deep navy background.';
export const size = imageSize;
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return generateSiteImage();
}

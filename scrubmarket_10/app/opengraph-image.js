import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'ScrubMarket — matériel médical d’occasion entre professionnels';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const PHOTO =
  'https://images.unsplash.com/photo-1640876777012-bdb00a6323e2?auto=format&fit=crop&w=1200&q=80';

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', backgroundColor: '#2C3432' }}>
        <img src={PHOTO} width={1200} height={630} style={{ position: 'absolute', top: 0, left: 0, width: 1200, height: 630, objectFit: 'cover' }} />
        <div
          style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, height: 240,
            display: 'flex', alignItems: 'center', paddingLeft: 64, gap: 24,
            backgroundImage: 'linear-gradient(180deg, rgba(28,32,30,0) 0%, rgba(28,32,30,0.95) 62%)',
          }}
        >
          <svg width="84" height="84" viewBox="21 20 58 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M60 23 L38 23 A13 13 0 0 0 25 36 L25 52 A15 15 0 0 0 50.6 62.6 L63 50" stroke="#F4F7F7" strokeWidth="5.2" strokeLinecap="round" />
            <path d="M60 23 L38 23 A13 13 0 0 0 25 36 L25 52 A15 15 0 0 0 50.6 62.6 L63 50" stroke="#F4F7F7" strokeWidth="5.2" strokeLinecap="round" transform="rotate(180 50 50)" />
            <path d="M46 54 L54 46" stroke="#2F8F7D" strokeWidth="5.2" strokeLinecap="round" />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 44, letterSpacing: 9, color: '#F2F1ED', fontWeight: 600 }}>SCRUBMARKET</div>
            <div style={{ fontSize: 26, color: '#B9C4C1', marginTop: 6 }}>scrub-market.com</div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

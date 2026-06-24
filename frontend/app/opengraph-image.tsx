import { ImageResponse } from 'next/og';
import { siteConfig } from '@/config/site';

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 80,
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #0f766e 100%)',
        color: '#ffffff',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          opacity: 0.85,
        }}
      >
        {siteConfig.name}
      </div>
      <div
        style={{
          marginTop: 24,
          fontSize: 64,
          fontWeight: 700,
          lineHeight: 1.1,
          maxWidth: 900,
        }}
      >
        {siteConfig.tagline}
      </div>
      <div
        style={{
          marginTop: 32,
          fontSize: 28,
          lineHeight: 1.4,
          maxWidth: 800,
          opacity: 0.9,
        }}
      >
        Construction et ingénierie industrielle au Maroc
      </div>
    </div>,
    { ...size },
  );
}

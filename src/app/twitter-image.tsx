import { ImageResponse } from 'next/og'
import { siteConfig } from '@/config/site'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          borderTop: '20px solid #D4AF37',
          padding: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              color: '#fff',
              fontSize: '84px',
              fontFamily: 'sans-serif',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginBottom: '24px',
            }}
          >
            SQUARE AR
          </div>
          <div
            style={{
              color: '#D4AF37',
              fontSize: '48px',
              fontFamily: 'sans-serif',
              fontWeight: 'bold',
              letterSpacing: '0.1em',
              marginBottom: '48px',
            }}
          >
            SPACES
          </div>
          <div
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '32px',
              maxWidth: '800px',
              lineHeight: 1.5,
              fontWeight: 300,
            }}
          >
            {siteConfig.tagline}
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}

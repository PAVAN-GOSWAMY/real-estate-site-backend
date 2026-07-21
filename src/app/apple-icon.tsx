import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#111',
          border: '4px solid #D4AF37',
        }}
      >
        <div
          style={{
            color: '#D4AF37',
            fontSize: '90px',
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
          }}
        >
          S
        </div>
      </div>
    ),
    { ...size }
  )
}

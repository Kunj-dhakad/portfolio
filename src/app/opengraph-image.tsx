import { ImageResponse } from 'next/og';
export const alt = 'Navonixx — Ideas into products. Built for what’s next.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: '#edf1f7',
        padding: 90,
        color: '#253a5b',
        border: '20px solid #e1e9f5',
      }}
    >
      <div style={{ display: 'flex', fontSize: 30, color: '#3479d7', marginBottom: 40 }}>
        Navonixx / Digital product studio
      </div>
      <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, letterSpacing: -4 }}>
        Ideas into products.
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: 76,
          fontWeight: 700,
          letterSpacing: -4,
          color: '#286add',
        }}
      >
        Built for what’s next.
      </div>
      <div style={{ display: 'flex', fontSize: 25, color: '#6a809e', marginTop: 45 }}>
        SaaS · Web applications · AI integrations
      </div>
    </div>,
    size,
  );
}

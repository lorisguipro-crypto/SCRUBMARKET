export default function manifest() {
  return {
    name: "ScrubMarket — matériel médical d'occasion",
    short_name: 'ScrubMarket',
    description:
      "La place de marché du matériel médical d'occasion réservée aux professionnels de santé.",
    start_url: '/',
    display: 'standalone',
    background_color: '#08376a',
    theme_color: '#0e5aa7',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}

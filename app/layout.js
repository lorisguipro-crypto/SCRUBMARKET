import './globals.css';
import Link from 'next/link';
import { Analytics } from '@vercel/analytics/react';
import Nav from '@/components/Nav';
import ProGate from '@/components/ProGate';
import PWARegister from '@/components/PWARegister';

export const metadata = {
  title: "ScrubMarket — matériel médical d'occasion entre professionnels",
  description:
    "La place de marché du matériel médical d'occasion réservée aux professionnels de santé vérifiés.",
  appleWebApp: { capable: true, title: 'ScrubMarket', statusBarStyle: 'default' },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

export const viewport = {
  themeColor: '#2c3432',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <ProGate />
        <Nav />
        <main className="container">{children}</main>
        <footer className="footer container">
          <div className="footer-inner">
            <span>ScrubMarket · réservé aux professionnels de santé.</span>
            <span className="footer-links">
              <Link href="/comment-ca-marche">Comment ça marche</Link>
              <Link href="/mentions-legales">Mentions légales &amp; CGU</Link>
            </span>
          </div>
        </footer>
        <PWARegister />
        <Analytics />
      </body>
    </html>
  );
}

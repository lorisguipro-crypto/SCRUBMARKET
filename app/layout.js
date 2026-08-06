import './globals.css';
import Nav from '@/components/Nav';

export const metadata = {
  title: "MedOccaz — matériel médical d'occasion entre professionnels",
  description:
    "La place de marché du matériel médical d'occasion réservée aux professionnels de santé vérifiés.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Nav />
        <main className="container">{children}</main>
        <footer className="footer container">
          MedOccaz · MVP de test — réservé aux professionnels de santé.
          Nom et marque provisoires.
        </footer>
      </body>
    </html>
  );
}

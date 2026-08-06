import Link from 'next/link';

export default function Nav() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="brand">MedOccaz</Link>
        <nav className="nav-links">
          <Link href="/annonces">Parcourir</Link>
          <Link href="/comment-ca-marche">Comment ça marche</Link>
          <Link href="/deposer" className="btn btn-primary">Déposer une annonce</Link>
        </nav>
      </div>
    </header>
  );
}

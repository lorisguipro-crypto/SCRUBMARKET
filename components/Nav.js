import Link from 'next/link';

export default function Nav() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="brand">ScrubMarket</Link>
        <nav className="nav-links">
          <Link href="/annonces">Parcourir</Link>
          <Link href="/comment-ca-marche" className="comment-link">Comment ça marche</Link>
          <Link href="/deposer" className="btn btn-primary">
            <span className="lbl-full">Déposer une annonce</span>
            <span className="lbl-short">+ Déposer</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

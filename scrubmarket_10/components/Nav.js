'use client';

import Link from 'next/link';
import { useUser } from '@/lib/useUser';

function Mark() {
  return (
    <svg viewBox="21 20 58 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M60 23 L38 23 A13 13 0 0 0 25 36 L25 52 A15 15 0 0 0 50.6 62.6 L63 50" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <path d="M60 23 L38 23 A13 13 0 0 0 25 36 L25 52 A15 15 0 0 0 50.6 62.6 L63 50" stroke="currentColor" strokeWidth="5" strokeLinecap="round" transform="rotate(180 50 50)" />
      <path d="M46 54 L54 46" stroke="#2F8F7D" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

export default function Nav() {
  const { user } = useUser();
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="brand" aria-label="ScrubMarket">
          <Mark />
          <span>ScrubMarket</span>
        </Link>
        <nav className="nav-links">
          <Link href="/annonces">Parcourir</Link>
          <Link href="/comment-ca-marche" className="comment-link">Comment ça marche</Link>
          {user ? (
            <Link href="/compte">Mon compte</Link>
          ) : (
            <Link href="/compte" className="comment-link">Se connecter</Link>
          )}
          <Link href="/deposer" className="btn btn-primary">
            <span className="lbl-full">Déposer une annonce</span>
            <span className="lbl-short">+ Déposer</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

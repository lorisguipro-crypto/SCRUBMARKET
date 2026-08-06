'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function Home() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  async function subscribe(e) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    const { error } = await supabase.from('leads').insert({ email });
    setStatus(error ? 'error' : 'done');
  }

  return (
    <div>
      <section className="hero">
        <p className="eyebrow">Réservé aux professionnels de santé</p>
        <h1>Le matériel médical d&apos;occasion, entre praticiens de confiance.</h1>
        <p className="lead">
          Vendez et trouvez de l&apos;équipement réutilisable — blocs, cabinets,
          imagerie, endoscopie — directement entre professionnels vérifiés, sans
          intermédiaire.
        </p>
        <div className="hero-actions">
          <Link href="/annonces" className="btn btn-primary">Parcourir les annonces</Link>
          <Link href="/deposer" className="btn btn-ghost">Déposer une annonce</Link>
        </div>
      </section>

      <section className="signup">
        <h2>Être prévenu au lancement</h2>
        <p>Laissez votre email professionnel, on vous écrit dès l&apos;ouverture.</p>
        {status === 'done' ? (
          <p className="success">Merci — vous êtes sur la liste.</p>
        ) : (
          <form onSubmit={subscribe} className="signup-form">
            <input
              type="email"
              required
              placeholder="prenom@cabinet.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn btn-primary" disabled={status === 'loading'}>
              {status === 'loading' ? '…' : 'Me prévenir'}
            </button>
          </form>
        )}
        {status === 'error' && <p className="error">Une erreur est survenue. Réessayez.</p>}
      </section>

      <section className="valueprops">
        <div className="vp">
          <span className="vp-badge">Vérifié</span>
          <h3>Entre professionnels</h3>
          <p>Vendeurs et acheteurs sont des professionnels de santé identifiés.</p>
        </div>
        <div className="vp">
          <span className="vp-badge">Direct</span>
          <h3>Sans intermédiaire</h3>
          <p>Vous traitez en direct. La plateforme met en relation, sans prendre le matériel.</p>
        </div>
        <div className="vp">
          <span className="vp-badge">Conforme</span>
          <h3>Matériel déclaré</h3>
          <p>Chaque vendeur atteste du marquage CE et de l&apos;état de son dispositif.</p>
        </div>
      </section>
    </div>
  );
}

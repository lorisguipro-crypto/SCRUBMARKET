'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

const CATEGORIES = [
  'Endoscopie',
  'Gynécologie',
  'Urologie',
  'Imagerie',
  'Bloc opératoire',
  'Mobilier & cabinet',
];

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
        <div className="hero-content">
          <p className="hero-eyebrow">Réservé aux professionnels de santé</p>
          <h1>{"Le matériel médical d'occasion, entre praticiens de confiance."}</h1>
          <p className="hero-lead">
            {"Blocs, cabinets, imagerie, endoscopie : achetez et vendez de l'équipement réutilisable directement entre professionnels vérifiés, sans intermédiaire."}
          </p>
          <div className="hero-actions">
            <Link href="/annonces" className="btn btn-light">Parcourir les annonces</Link>
            <Link href="/deposer" className="btn btn-outline-light">Déposer une annonce</Link>
          </div>
        </div>
      </section>

      <section className="reassure">
        <div className="reassure-item"><span className="tick">✓</span> Professionnels vérifiés</div>
        <div className="reassure-item"><span className="tick">✓</span> Conformité CE déclarée</div>
        <div className="reassure-item"><span className="tick">✓</span> Sans intermédiaire</div>
        <div className="reassure-item"><span className="tick">✓</span> Contact direct vendeur</div>
      </section>

      <section className="home-section">
        <h2 className="section-title">Explorer par spécialité</h2>
        <div className="cats">
          {CATEGORIES.map((nom) => (
            <Link key={nom} href="/annonces" className="cat-card">
              <span className="cat-name">{nom}</span>
              <span className="cat-link">Voir les annonces →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="showcase">
        <div className="showcase-media">
          <img
            src="https://images.unsplash.com/photo-1640876777002-badf6aee5bcc?auto=format&fit=crop&w=1200&q=80"
            alt="Équipe au bloc opératoire"
          />
        </div>
        <div className="showcase-text">
          <h2>Pensé pour le terrain</h2>
          <p>
            {"Vous connaissez la valeur d'un équipement qui a déjà fait ses preuves. Donnez une seconde vie au matériel réutilisable, ou trouvez la pièce qui vous manque — au prix juste, entre gens du métier."}
          </p>
          <div className="steps">
            <div className="step">
              <span className="step-num">1</span>
              <div><strong>Déposez</strong><br />{"Votre matériel en quelques minutes."}</div>
            </div>
            <div className="step">
              <span className="step-num">2</span>
              <div><strong>Échangez en direct</strong><br />{"L'acheteur vous contacte, sans intermédiaire."}</div>
            </div>
            <div className="step">
              <span className="step-num">3</span>
              <div><strong>Concluez en confiance</strong><br />{"Conformité déclarée à chaque annonce."}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="signup">
        <h2>Être prévenu au lancement</h2>
        <p>{"Laissez votre email professionnel, on vous écrit dès l'ouverture."}</p>
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
            <button className="btn btn-light" disabled={status === 'loading'}>
              {status === 'loading' ? '…' : 'Me prévenir'}
            </button>
          </form>
        )}
        {status === 'error' && <p className="error">Une erreur est survenue. Réessayez.</p>}
      </section>
    </div>
  );
}

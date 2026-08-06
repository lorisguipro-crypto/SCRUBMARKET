'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

// Page volontairement minimale : connexion par lien magique (magic link).
// Facultative au tout début — utile quand tu voudras rattacher les annonces
// à un compte vendeur. Non reliée au dépôt pour l'instant.
export default function ComptePage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  async function login(e) {
    e.preventDefault();
    setStatus('loading');
    const { error } = await supabase.auth.signInWithOtp({ email });
    setStatus(error ? 'error' : 'sent');
  }

  return (
    <div style={{ maxWidth: 440, margin: '0 auto' }}>
      <div className="page-head">
        <h1>Mon compte</h1>
        <p className="hint">Connexion par lien envoyé à votre email — sans mot de passe.</p>
      </div>
      {status === 'sent' ? (
        <p className="success">Lien envoyé. Consultez votre boîte email.</p>
      ) : (
        <form onSubmit={login}>
          <div className="field">
            <label>Email professionnel</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button className="btn btn-primary" disabled={status === 'loading'}>
            {status === 'loading' ? 'Envoi…' : 'Recevoir mon lien de connexion'}
          </button>
          {status === 'error' && <p className="error">Une erreur est survenue. Réessayez.</p>}
        </form>
      )}
    </div>
  );
}

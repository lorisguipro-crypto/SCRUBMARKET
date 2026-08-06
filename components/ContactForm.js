'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ContactForm({ annonceId }) {
  const [form, setForm] = useState({ nom: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setStatus('loading');
    const { error } = await supabase.from('contacts').insert({
      annonce_id: annonceId,
      acheteur_nom: form.nom,
      acheteur_email: form.email,
      message: form.message,
    });
    setStatus(error ? 'error' : 'done');
  }

  if (status === 'done') {
    return (
      <div className="contact-box">
        <p className="success">Message envoyé. Le vendeur vous recontactera par email.</p>
      </div>
    );
  }

  return (
    <div className="contact-box">
      <h2>Contacter le vendeur</h2>
      <form onSubmit={submit}>
        <div className="field">
          <label>Votre nom</label>
          <input value={form.nom} onChange={(e) => update('nom', e.target.value)} />
        </div>
        <div className="field">
          <label>Votre email professionnel</label>
          <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} />
        </div>
        <div className="field">
          <label>Message</label>
          <textarea
            placeholder="Bonjour, ce matériel est-il toujours disponible ?"
            value={form.message}
            onChange={(e) => update('message', e.target.value)}
          />
        </div>
        <button className="btn btn-primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'Envoi…' : 'Envoyer ma demande'}
        </button>
        {status === 'error' && <p className="error">Une erreur est survenue. Réessayez.</p>}
      </form>
    </div>
  );
}

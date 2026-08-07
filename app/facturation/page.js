'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@/lib/useUser';

const MENTIONS = [
  'TVA non applicable, art. 293 B du CGI',
  'Régime particulier – Biens d’occasion (art. 297 A du CGI)',
  'Opération exonérée de TVA',
];

export default function FacturationPage() {
  const { user, loading } = useUser();
  const [form, setForm] = useState({
    raison_sociale: '', adresse: '', siret: '', mentions_complementaires: '',
    mention_tva: MENTIONS[0], mention_autre: '',
  });
  const [status, setStatus] = useState('idle');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from('profil_facturation').select('*').eq('user_id', user.id).single().then(({ data }) => {
      if (data) {
        const known = MENTIONS.includes(data.mention_tva);
        setForm({
          raison_sociale: data.raison_sociale || '', adresse: data.adresse || '', siret: data.siret || '',
          mentions_complementaires: data.mentions_complementaires || '',
          mention_tva: data.mention_tva ? (known ? data.mention_tva : 'Autre') : MENTIONS[0],
          mention_autre: data.mention_tva && !known ? data.mention_tva : '',
        });
      }
      setLoaded(true);
    });
  }, [user]);

  function up(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function save(e) {
    e.preventDefault();
    setStatus('loading');
    const mention = form.mention_tva === 'Autre' ? form.mention_autre : form.mention_tva;
    const { error } = await supabase.from('profil_facturation').upsert({
      user_id: user.id,
      raison_sociale: form.raison_sociale || null,
      adresse: form.adresse || null,
      siret: form.siret || null,
      mentions_complementaires: form.mentions_complementaires || null,
      mention_tva: mention || null,
      updated_at: new Date().toISOString(),
    });
    setStatus(error ? 'error' : 'done');
  }

  if (loading || (user && !loaded)) return <div className="container loading">Chargement…</div>;
  if (!user) {
    return (
      <div className="container" style={{ maxWidth: 440 }}>
        <div className="page-head"><h1>Infos de facturation</h1>
          <p className="hint">Connectez-vous pour renseigner vos informations.</p></div>
        <Link href="/compte" className="btn btn-primary">Se connecter</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 620 }}>
      <div className="page-head">
        <h1>Mes informations de facturation</h1>
        <p className="hint">Ces informations apparaîtront sur les factures que vous générez, en tant que vendeur.</p>
      </div>
      <form onSubmit={save}>
        <div className="field">
          <label>Raison sociale / Nom *</label>
          <input required value={form.raison_sociale} onChange={(e) => up('raison_sociale', e.target.value)} placeholder="Dr Martin Meyer — ou LGD Médical" />
        </div>
        <div className="field">
          <label>Adresse</label>
          <textarea value={form.adresse} onChange={(e) => up('adresse', e.target.value)} placeholder="12 rue… 69000 Lyon" style={{ minHeight: 70 }} />
        </div>
        <div className="field">
          <label>SIRET</label>
          <input value={form.siret} onChange={(e) => up('siret', e.target.value)} placeholder="123 456 789 00012" />
        </div>
        <div className="field">
          <label>Mention de TVA</label>
          <select value={form.mention_tva} onChange={(e) => up('mention_tva', e.target.value)}>
            {MENTIONS.map((m) => (<option key={m} value={m}>{m}</option>))}
            <option value="Autre">Autre (préciser)…</option>
          </select>
          {form.mention_tva === 'Autre' && (
            <input style={{ marginTop: 8 }} value={form.mention_autre} onChange={(e) => up('mention_autre', e.target.value)} placeholder="Votre mention exacte" />
          )}
          <p className="hint">⚠️ À faire confirmer par votre comptable : la mention exacte dépend de votre régime (franchise en base, régime de la marge, exonération…).</p>
        </div>
        <div className="field">
          <label>Mentions complémentaires (facultatif)</label>
          <textarea value={form.mentions_complementaires} onChange={(e) => up('mentions_complementaires', e.target.value)} placeholder="Forme juridique, capital, RCS, N° TVA intracommunautaire…" style={{ minHeight: 60 }} />
        </div>
        <button className="btn btn-primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'Enregistrement…' : 'Enregistrer'}
        </button>
        {status === 'done' && <p className="success">Informations enregistrées.</p>}
        {status === 'error' && <p className="error">Une erreur est survenue. Réessayez.</p>}
      </form>
      <Link href="/compte" className="back">← Retour au compte</Link>
    </div>
  );
}

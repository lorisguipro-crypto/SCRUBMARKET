'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@/lib/useUser';

export default function NouvelleFacture() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [profil, setProfil] = useState(null);
  const [status, setStatus] = useState('idle');
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState({
    acheteur_nom: '', acheteur_adresse: '', acheteur_siret: '',
    designation: '', quantite: '1', prix_unitaire: '',
    date_emission: new Date().toISOString().slice(0, 10), mention_tva: '',
  });

  useEffect(() => {
    if (!user || typeof window === 'undefined') return;
    (async () => {
      const { data: pf } = await supabase.from('profil_facturation').select('*').eq('user_id', user.id).single();
      setProfil(pf || null);
      const annonceId = new URLSearchParams(window.location.search).get('annonce');
      let designation = '', pu = '';
      if (annonceId) {
        const { data: a } = await supabase.from('annonces').select('titre, prix, marque').eq('id', annonceId).single();
        if (a) {
          designation = [a.marque, a.titre].filter(Boolean).join(' — ') || a.titre || '';
          pu = a.prix != null ? String(a.prix) : '';
        }
      }
      setForm((f) => ({ ...f, designation, prix_unitaire: pu, mention_tva: pf?.mention_tva || '' }));
      setReady(true);
    })();
  }, [user]);

  function up(k, v) { setForm((f) => ({ ...f, [k]: v })); }
  const total = (Number(form.quantite || 0) * Number(form.prix_unitaire || 0)) || 0;

  async function submit(e) {
    e.preventDefault();
    setStatus('loading');
    const { count } = await supabase.from('factures').select('id', { count: 'exact', head: true }).eq('user_id', user.id);
    const seq = (count || 0) + 1;
    const numero = `F${new Date(form.date_emission).getFullYear()}-${String(seq).padStart(4, '0')}`;
    const { data, error } = await supabase.from('factures').insert({
      user_id: user.id,
      numero,
      date_emission: form.date_emission,
      vendeur_raison_sociale: profil?.raison_sociale || null,
      vendeur_adresse: profil?.adresse || null,
      vendeur_siret: profil?.siret || null,
      vendeur_mentions: profil?.mentions_complementaires || null,
      acheteur_nom: form.acheteur_nom || null,
      acheteur_adresse: form.acheteur_adresse || null,
      acheteur_siret: form.acheteur_siret || null,
      designation: form.designation || null,
      quantite: Number(form.quantite || 1),
      prix_unitaire: Number(form.prix_unitaire || 0),
      total,
      mention_tva: form.mention_tva || null,
    }).select().single();
    if (error) { setStatus('error'); return; }
    router.push(`/facture/${data.id}`);
  }

  if (loading || (user && !ready)) return <div className="container loading">Chargement…</div>;
  if (!user) {
    return (
      <div className="container" style={{ maxWidth: 440 }}>
        <div className="page-head"><h1>Créer une facture</h1></div>
        <Link href="/compte" className="btn btn-primary">Se connecter</Link>
      </div>
    );
  }

  const profilIncomplet = !profil?.raison_sociale;

  return (
    <div className="container" style={{ maxWidth: 620 }}>
      <div className="page-head">
        <h1>Créer une facture</h1>
        <p className="hint">Facture émise à votre nom (vendeur). Total net, sans TVA selon votre mention.</p>
      </div>

      {profilIncomplet && (
        <div className="note">
          Vos informations de facturation sont incomplètes.{' '}
          <Link href="/facturation" style={{ color: 'var(--primary)', fontWeight: 600 }}>Renseignez-les d'abord →</Link>
        </div>
      )}

      <form onSubmit={submit}>
        <div className="form-row">
          <div className="field"><label>Date</label>
            <input type="date" value={form.date_emission} onChange={(e) => up('date_emission', e.target.value)} /></div>
          <div className="field"><label>Mention de TVA</label>
            <input value={form.mention_tva} onChange={(e) => up('mention_tva', e.target.value)} placeholder="TVA non applicable…" /></div>
        </div>

        <h2 style={{ fontSize: 18, margin: '10px 0 12px' }}>Acheteur</h2>
        <div className="field"><label>Nom / Raison sociale *</label>
          <input required value={form.acheteur_nom} onChange={(e) => up('acheteur_nom', e.target.value)} /></div>
        <div className="field"><label>Adresse</label>
          <textarea value={form.acheteur_adresse} onChange={(e) => up('acheteur_adresse', e.target.value)} style={{ minHeight: 60 }} /></div>
        <div className="field"><label>SIRET (facultatif)</label>
          <input value={form.acheteur_siret} onChange={(e) => up('acheteur_siret', e.target.value)} /></div>

        <h2 style={{ fontSize: 18, margin: '10px 0 12px' }}>Matériel</h2>
        <div className="field"><label>Désignation *</label>
          <input required value={form.designation} onChange={(e) => up('designation', e.target.value)} /></div>
        <div className="form-row">
          <div className="field"><label>Quantité</label>
            <input type="number" min="1" value={form.quantite} onChange={(e) => up('quantite', e.target.value)} /></div>
          <div className="field"><label>Prix unitaire (€)</label>
            <input type="number" value={form.prix_unitaire} onChange={(e) => up('prix_unitaire', e.target.value)} /></div>
        </div>

        <p style={{ fontSize: 18, fontWeight: 700, margin: '4px 0 20px' }}>
          Total : {total.toLocaleString('fr-FR')} €
        </p>

        <button className="btn btn-primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'Création…' : 'Créer la facture'}
        </button>
        {status === 'error' && <p className="error">Une erreur est survenue. Réessayez.</p>}
      </form>
      <Link href="/compte" className="back">← Retour au compte</Link>
    </div>
  );
}

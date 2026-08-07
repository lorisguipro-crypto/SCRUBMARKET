'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

const COMMISSION = 0.05; // 5 % prélevés sur le prix (maquette)

export default function AcheterPage() {
  const { id } = useParams();
  const [annonce, setAnnonce] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);

  useEffect(() => {
    supabase.from('annonces').select('*, categories(nom)').eq('id', id).single().then(({ data }) => {
      setAnnonce(data); setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="container loading">Chargement…</div>;
  if (!annonce) return (
    <div className="container">
      <div className="empty">Annonce introuvable.</div>
      <Link href="/annonces" className="back">← Retour aux annonces</Link>
    </div>
  );

  const prix = Number(annonce.prix || 0);
  const commission = Math.round(prix * COMMISSION * 100) / 100;
  const vendeurRecoit = Math.round((prix - commission) * 100) / 100;
  const money = (n) => Number(n || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

  return (
    <div className="container" style={{ maxWidth: 560 }}>
      <div className="sim-banner">⚠️ Démonstration — aucun paiement réel n'est effectué.</div>
      <div className="page-head">
        <h1>Achat</h1>
        <p className="hint">{annonce.marque ? annonce.marque + ' — ' : ''}{annonce.titre}</p>
      </div>

      <div className="steps-bar">
        <span className={step >= 1 ? 'on' : ''}>1. Récapitulatif</span>
        <span className={step >= 2 ? 'on' : ''}>2. Paiement</span>
        <span className={step >= 3 ? 'on' : ''}>3. Confirmation</span>
      </div>

      {step === 1 && (
        <div className="pay-card">
          <div className="pay-row"><span>Matériel</span><strong>{annonce.titre}</strong></div>
          <div className="pay-row"><span>Prix</span><strong>{money(prix)}</strong></div>
          <div className="pay-row muted"><span>Commission ScrubMarket (5 %)</span><span>− {money(commission)}</span></div>
          <div className="pay-row muted"><span>Le vendeur reçoit</span><span>{money(vendeurRecoit)}</span></div>
          <div className="pay-total"><span>Total à payer</span><strong>{money(prix)}</strong></div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setStep(2)}>Continuer vers le paiement</button>
          <Link href={`/annonces/${id}`} className="back">← Retour à l'annonce</Link>
        </div>
      )}

      {step === 2 && (
        <div className="pay-card">
          <p className="sim-note">Champs de démonstration — n'entrez pas de vraie carte bancaire.</p>
          <div className="field"><label>Numéro de carte</label><input value="4242 4242 4242 4242" readOnly /></div>
          <div className="form-row">
            <div className="field"><label>Expiration</label><input value="12 / 30" readOnly /></div>
            <div className="field"><label>CVC</label><input value="123" readOnly /></div>
          </div>
          <div className="field"><label>Titulaire</label><input placeholder="Nom sur la carte" /></div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setStep(3)}>Payer {money(prix)}</button>
          <button className="btn btn-ghost" style={{ width: '100%', marginTop: 8 }} onClick={() => setStep(1)}>Retour</button>
        </div>
      )}

      {step === 3 && (
        <div className="pay-card pay-done">
          <div className="pay-check">✓</div>
          <h2 style={{ margin: '0 0 2px' }}>Paiement effectué</h2>
          <p className="hint">(simulation)</p>
          <div style={{ textAlign: 'left', marginTop: 14 }}>
            <div className="pay-row"><span>Montant payé</span><strong>{money(prix)}</strong></div>
            <div className="pay-row muted"><span>Reversé au vendeur</span><span>{money(vendeurRecoit)}</span></div>
            <div className="pay-row muted"><span>Commission ScrubMarket</span><span>{money(commission)}</span></div>
          </div>
          <p className="sim-note" style={{ marginTop: 16 }}>
            Dans la version réelle, une facture serait générée automatiquement à partir de ce paiement,
            et le vendeur serait payé via Stripe (le montant facturé = le montant payé).
          </p>
          <Link href="/annonces" className="btn btn-primary" style={{ width: '100%' }}>Retour aux annonces</Link>
        </div>
      )}
    </div>
  );
}

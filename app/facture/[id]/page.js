'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function FactureView() {
  const { id } = useParams();
  const [f, setF] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('factures').select('*').eq('id', id).single().then(({ data }) => {
      setF(data); setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="container loading">Chargement…</div>;
  if (!f) return (
    <div className="container">
      <div className="empty">Facture introuvable.</div>
      <Link href="/compte" className="back">← Retour au compte</Link>
    </div>
  );

  const money = (n) => Number(n || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  const date = f.date_emission ? new Date(f.date_emission).toLocaleDateString('fr-FR') : '';

  return (
    <div className="container facture-wrap">
      <div className="facture-actions no-print">
        <button className="btn btn-primary" onClick={() => window.print()}>Imprimer / Télécharger en PDF</button>
        <Link href="/compte" className="btn btn-ghost">Retour</Link>
      </div>

      <div className="facture">
        <div className="fac-head">
          <div className="fac-brand">SCRUBMARKET</div>
          <h1>Facture</h1>
          <p className="fac-num">N° {f.numero} · {date}</p>
        </div>

        <div className="fac-parties">
          <div>
            <div className="fac-label">Vendeur</div>
            <strong>{f.vendeur_raison_sociale || '—'}</strong>
            {f.vendeur_adresse && <div className="fac-multi">{f.vendeur_adresse}</div>}
            {f.vendeur_siret && <div>SIRET : {f.vendeur_siret}</div>}
            {f.vendeur_mentions && <div className="fac-multi fac-small">{f.vendeur_mentions}</div>}
          </div>
          <div>
            <div className="fac-label">Acheteur</div>
            <strong>{f.acheteur_nom || '—'}</strong>
            {f.acheteur_adresse && <div className="fac-multi">{f.acheteur_adresse}</div>}
            {f.acheteur_siret && <div>SIRET : {f.acheteur_siret}</div>}
          </div>
        </div>

        <table className="fac-table">
          <thead>
            <tr><th>Désignation</th><th>Qté</th><th>Prix unitaire</th><th>Montant</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>{f.designation}</td>
              <td>{f.quantite}</td>
              <td>{money(f.prix_unitaire)}</td>
              <td>{money(f.total)}</td>
            </tr>
          </tbody>
        </table>

        <div className="fac-total"><span>Total net à payer</span><strong>{money(f.total)}</strong></div>
        {f.mention_tva && <p className="fac-tva">{f.mention_tva}</p>}

        <div className="fac-legal">
          <p>Conditions de règlement : paiement à réception.</p>
          <p>En cas de retard de paiement : pénalités au taux de 3 fois le taux d'intérêt légal, et indemnité forfaitaire pour frais de recouvrement de 40 € (art. L441-10 et D441-5 du code de commerce).</p>
          <p className="fac-small">Facture générée via ScrubMarket pour le compte du vendeur. ScrubMarket est un intermédiaire de mise en relation et n'est pas partie à la vente.</p>
        </div>
      </div>
    </div>
  );
}

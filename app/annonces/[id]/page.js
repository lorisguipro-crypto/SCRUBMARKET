'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import ContactForm from '@/components/ContactForm';

export default function AnnonceDetail() {
  const { id } = useParams();
  const [annonce, setAnnonce] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('annonces')
        .select('*, categories(nom)')
        .eq('id', id)
        .single();
      setAnnonce(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <p className="loading">Chargement…</p>;
  if (!annonce)
    return (
      <div>
        <div className="empty">Annonce introuvable.</div>
        <Link href="/annonces" className="back">← Retour aux annonces</Link>
      </div>
    );

  const prix = annonce.prix
    ? `${Number(annonce.prix).toLocaleString('fr-FR')} €`
    : 'Prix à discuter';
  const photos = Array.isArray(annonce.photos) ? annonce.photos : [];
  const sub = [annonce.categories?.nom, annonce.ville].filter(Boolean).join(' · ');

  const dateMES = annonce.date_mise_en_service
    ? new Date(annonce.date_mise_en_service).toLocaleDateString('fr-FR')
    : null;

  const specs = [
    ['Marque', annonce.marque],
    ['Type de matériel', annonce.type_materiel],
    ['État', annonce.etat],
    ['Année de fabrication', annonce.annee_fabrication],
    ['Mise en service', dateMES],
    ['Fiche de traçabilité', annonce.fiche_tracabilite ? 'Oui' : null],
  ].filter(([, v]) => v);

  return (
    <div>
      <div className="detail">
        <div className="detail-media">
          {photos.length ? (
            photos.map((src, i) => <img key={i} src={src} alt={`${annonce.titre} ${i + 1}`} />)
          ) : (
            <div className="card-media-empty" style={{ height: 260, borderRadius: 10, background: 'var(--primary-soft)' }}>
              Pas de photo
            </div>
          )}
        </div>

        <div className="detail-info">
          {annonce.declarations_ok && (
            <span className="ce-pill">✓ Conformité déclarée par le vendeur</span>
          )}
          <h1>{annonce.titre}</h1>
          {sub && <p className="card-sub">{sub}</p>}
          {annonce.statut === 'vendue' && <span className="sold-badge detail-sold">Vendu</span>}
          <p className="detail-price">{prix}</p>
          {annonce.prix != null && annonce.statut !== 'vendue' && (
            <Link href={`/acheter/${annonce.id}`} className="btn btn-primary" style={{ marginBottom: 16 }}>
              Acheter — {prix}
            </Link>
          )}

          {specs.length > 0 && (
            <dl className="spec">
              {specs.map(([k, v]) => (
                <div className="spec-row" key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          )}

          <p className="detail-desc">{annonce.description || 'Aucune description fournie.'}</p>
          <ContactForm annonceId={annonce.id} />
        </div>
      </div>
      <Link href="/annonces" className="back">← Retour aux annonces</Link>
    </div>
  );
}

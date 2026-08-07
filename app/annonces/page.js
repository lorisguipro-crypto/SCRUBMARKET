'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import AnnonceCard from '@/components/AnnonceCard';
import { FOURCHETTES_PRIX } from '@/lib/catalogues';

export default function AnnoncesPage() {
  const [annonces, setAnnonces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cat, setCat] = useState('');
  const [marque, setMarque] = useState('');
  const [typeM, setTypeM] = useState('');
  const [prixIdx, setPrixIdx] = useState('');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCat = params.get('cat');
    if (urlCat) setCat(urlCat);

    async function load() {
      const [cats, ann] = await Promise.all([
        supabase.from('categories').select('*').order('nom'),
        supabase
          .from('annonces')
          .select('*, categories(nom)')
          .eq('statut', 'active')
          .order('created_at', { ascending: false }),
      ]);
      setCategories(cats.data || []);
      setAnnonces(ann.data || []);
      setLoading(false);
    }
    load();
  }, []);

  // Options de filtres construites à partir des annonces réellement présentes
  const marquesPresentes = [...new Set(annonces.map((a) => a.marque).filter(Boolean))].sort();
  const typesPresents = [...new Set(annonces.map((a) => a.type_materiel).filter(Boolean))].sort();

  const filtered = annonces.filter((a) => {
    if (cat && String(a.categorie_id) !== cat) return false;
    if (marque && a.marque !== marque) return false;
    if (typeM && a.type_materiel !== typeM) return false;
    if (prixIdx !== '') {
      const f = FOURCHETTES_PRIX[Number(prixIdx)];
      const p = Number(a.prix);
      if (!a.prix || p < f.min || p > f.max) return false;
    }
    if (q) {
      const hay = `${a.titre || ''} ${a.description || ''} ${a.marque || ''}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  function reset() {
    setCat(''); setMarque(''); setTypeM(''); setPrixIdx(''); setQ('');
  }
  const actifs = [cat, marque, typeM, prixIdx, q].filter((x) => x !== '').length;

  return (
    <div>
      <div className="page-head">
        <h1>Annonces</h1>
      </div>

      <div className="filters">
        <input
          type="search"
          placeholder="Rechercher (modèle, mot-clé…)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ maxWidth: 240 }}
        />
        <select value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">Toutes spécialités</option>
          {categories.map((c) => (<option key={c.id} value={String(c.id)}>{c.nom}</option>))}
        </select>
        <select value={typeM} onChange={(e) => setTypeM(e.target.value)}>
          <option value="">Tous types</option>
          {typesPresents.map((t) => (<option key={t} value={t}>{t}</option>))}
        </select>
        <select value={marque} onChange={(e) => setMarque(e.target.value)}>
          <option value="">Toutes marques</option>
          {marquesPresentes.map((m) => (<option key={m} value={m}>{m}</option>))}
        </select>
        <select value={prixIdx} onChange={(e) => setPrixIdx(e.target.value)}>
          <option value="">Tous prix</option>
          {FOURCHETTES_PRIX.map((f, i) => (<option key={i} value={String(i)}>{f.label}</option>))}
        </select>
        {actifs > 0 && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>Réinitialiser</button>
        )}
      </div>

      {loading ? (
        <p className="loading">Chargement…</p>
      ) : filtered.length === 0 ? (
        <div className="empty">
          {annonces.length === 0
            ? 'Aucune annonce pour le moment. Soyez le premier à en déposer une.'
            : 'Aucune annonce ne correspond à ces filtres. Élargissez votre recherche.'}
        </div>
      ) : (
        <div className="grid">
          {filtered.map((a) => (<AnnonceCard key={a.id} annonce={a} />))}
        </div>
      )}
    </div>
  );
}

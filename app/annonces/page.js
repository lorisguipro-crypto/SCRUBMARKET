'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import AnnonceCard from '@/components/AnnonceCard';

export default function AnnoncesPage() {
  const [annonces, setAnnonces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cat, setCat] = useState('');
  const [maxPrix, setMaxPrix] = useState('');
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

  const filtered = annonces.filter((a) => {
    if (cat && String(a.categorie_id) !== cat) return false;
    if (maxPrix && Number(a.prix) > Number(maxPrix)) return false;
    if (q) {
      const hay = `${a.titre || ''} ${a.description || ''}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div>
      <div className="page-head">
        <h1>Annonces</h1>
      </div>

      <div className="filters">
        <input
          type="search"
          placeholder="Rechercher (marque, modèle…)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ maxWidth: 280 }}
        />
        <select value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">Toutes les spécialités</option>
          {categories.map((c) => (
            <option key={c.id} value={String(c.id)}>{c.nom}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Prix max (€)"
          value={maxPrix}
          onChange={(e) => setMaxPrix(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="loading">Chargement…</p>
      ) : filtered.length === 0 ? (
        <div className="empty">
          {"Aucune annonce ne correspond. Élargissez votre recherche, ou déposez la première."}
        </div>
      ) : (
        <div className="grid">
          {filtered.map((a) => (
            <AnnonceCard key={a.id} annonce={a} />
          ))}
        </div>
      )}
    </div>
  );
}

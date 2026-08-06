'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function DeposerPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState('idle');
  const [form, setForm] = useState({
    titre: '',
    categorie_id: '',
    prix: '',
    ville: '',
    description: '',
    vendeur_email: '',
    vendeur_telephone: '',
    declarations_ok: false,
  });
  const [files, setFiles] = useState([]);

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('nom')
      .then(({ data }) => setCategories(data || []));
  }, []);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function uploadPhotos() {
    const urls = [];
    for (const file of files) {
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
      const { error } = await supabase.storage.from('annonces').upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from('annonces').getPublicUrl(path);
        urls.push(data.publicUrl);
      }
    }
    return urls;
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.declarations_ok) return;
    setStatus('loading');

    let photos = [];
    if (files.length) {
      try {
        photos = await uploadPhotos();
      } catch (_) {
        // si le bucket n'est pas prêt, on publie sans photo plutôt que d'échouer
        photos = [];
      }
    }

    const { data, error } = await supabase
      .from('annonces')
      .insert({
        titre: form.titre,
        categorie_id: form.categorie_id ? Number(form.categorie_id) : null,
        prix: form.prix ? Number(form.prix) : null,
        ville: form.ville || null,
        description: form.description || null,
        vendeur_email: form.vendeur_email,
        vendeur_telephone: form.vendeur_telephone || null,
        declarations_ok: form.declarations_ok,
        photos,
        statut: 'active',
      })
      .select()
      .single();

    if (error) {
      setStatus('error');
      return;
    }
    router.push(`/annonces/${data.id}`);
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div className="page-head">
        <h1>Déposer une annonce</h1>
        <p className="hint">
          Réservé au matériel réutilisable marqué CE. Sont exclus : usage unique,
          stérile, implantable, et tout dispositif périmé ou sous rappel.
        </p>
      </div>

      <form onSubmit={submit}>
        <div className="field">
          <label>Titre *</label>
          <input required value={form.titre} onChange={(e) => update('titre', e.target.value)} placeholder="Colonne d'endoscopie Karl Storz" />
        </div>

        <div className="field">
          <label>Spécialité</label>
          <select value={form.categorie_id} onChange={(e) => update('categorie_id', e.target.value)}>
            <option value="">— Choisir —</option>
            {categories.map((c) => (
              <option key={c.id} value={String(c.id)}>{c.nom}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Prix (€)</label>
          <input type="number" value={form.prix} onChange={(e) => update('prix', e.target.value)} placeholder="Laisser vide pour « à discuter »" />
        </div>

        <div className="field">
          <label>Ville</label>
          <input value={form.ville} onChange={(e) => update('ville', e.target.value)} placeholder="Lyon" />
        </div>

        <div className="field">
          <label>Description</label>
          <textarea value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="État, année, accessoires inclus, raison de la vente…" />
        </div>

        <div className="field">
          <label>Photos</label>
          <input type="file" accept="image/*" multiple onChange={(e) => setFiles(Array.from(e.target.files))} style={{ height: 'auto', padding: 10 }} />
          <p className="hint">Facultatif, mais les annonces avec photos reçoivent bien plus de contacts.</p>
        </div>

        <div className="field">
          <label>Votre email professionnel *</label>
          <input type="email" required value={form.vendeur_email} onChange={(e) => update('vendeur_email', e.target.value)} />
        </div>

        <div className="field">
          <label>Téléphone (facultatif)</label>
          <input value={form.vendeur_telephone} onChange={(e) => update('vendeur_telephone', e.target.value)} />
        </div>

        <div className="field check">
          <input id="decl" type="checkbox" checked={form.declarations_ok} onChange={(e) => update('declarations_ok', e.target.checked)} />
          <label htmlFor="decl">
            Je certifie que ce dispositif est marqué CE, authentique, non périmé, non
            sous rappel, jamais reconditionné hors cadre, et qu&apos;il n&apos;est ni à
            usage unique, ni stérile, ni implantable. *
          </label>
        </div>

        <button className="btn btn-primary" disabled={status === 'loading' || !form.declarations_ok}>
          {status === 'loading' ? 'Publication…' : 'Publier l\u2019annonce'}
        </button>
        {status === 'error' && <p className="error">Une erreur est survenue. Vérifiez votre configuration Supabase et réessayez.</p>}
      </form>
    </div>
  );
}

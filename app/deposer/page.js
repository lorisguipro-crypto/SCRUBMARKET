'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@/lib/useUser';
import { MARQUES, TYPES_MATERIEL, ETATS } from '@/lib/catalogues';

export default function DeposerPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState('idle');
  const [editId, setEditId] = useState(null);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [form, setForm] = useState({
    titre: '', categorie_id: '', type_materiel: '', marque: '', marque_autre: '',
    etat: '', annee_fabrication: '', date_mise_en_service: '', fiche_tracabilite: 'Non',
    serial_number: '', adresse_enlevement: '', prix: '', ville: '', description: '',
    vendeur_email: '', vendeur_telephone: '', declarations_ok: false,
  });
  const [files, setFiles] = useState([]);

  useEffect(() => {
    supabase.from('categories').select('*').order('nom').then(({ data }) => setCategories(data || []));
  }, []);

  useEffect(() => {
    if (user?.email) setForm((f) => (f.vendeur_email ? f : { ...f, vendeur_email: user.email }));
  }, [user]);

  // mode édition : /deposer?id=...
  useEffect(() => {
    if (!user || typeof window === 'undefined') return;
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) return;
    setEditId(id);
    (async () => {
      const { data } = await supabase.from('annonces').select('*').eq('id', id).single();
      const { data: prive } = await supabase.from('annonce_prive').select('serial_number, adresse_enlevement').eq('annonce_id', id).single();
      if (!data) return;
      const marqueConnue = data.marque && MARQUES.includes(data.marque);
      setForm({
        titre: data.titre || '',
        categorie_id: data.categorie_id ? String(data.categorie_id) : '',
        type_materiel: data.type_materiel || '',
        marque: data.marque ? (marqueConnue ? data.marque : 'Autre / non listée') : '',
        marque_autre: data.marque && !marqueConnue ? data.marque : '',
        etat: data.etat || '',
        annee_fabrication: data.annee_fabrication != null ? String(data.annee_fabrication) : '',
        date_mise_en_service: data.date_mise_en_service || '',
        fiche_tracabilite: data.fiche_tracabilite ? 'Oui' : 'Non',
        serial_number: prive?.serial_number || '',
        adresse_enlevement: prive?.adresse_enlevement || '',
        prix: data.prix != null ? String(data.prix) : '',
        ville: data.ville || '',
        description: data.description || '',
        vendeur_email: data.vendeur_email || '',
        vendeur_telephone: data.vendeur_telephone || '',
        declarations_ok: !!data.declarations_ok,
      });
      setExistingPhotos(data.photos || []);
    })();
  }, [user]);

  function update(key, value) { setForm((f) => ({ ...f, [key]: value })); }

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
    if (!form.declarations_ok || !user) return;
    setStatus('loading');

    let newPhotos = [];
    if (files.length) {
      try { newPhotos = await uploadPhotos(); } catch (_) { newPhotos = []; }
    }
    const photos = [...existingPhotos, ...newPhotos];

    const marqueFinale =
      form.marque === 'Autre / non listée' ? (form.marque_autre || null) : (form.marque || null);

    const payload = {
      titre: form.titre,
      categorie_id: form.categorie_id ? Number(form.categorie_id) : null,
      type_materiel: form.type_materiel || null,
      marque: marqueFinale,
      etat: form.etat || null,
      annee_fabrication: form.annee_fabrication ? Number(form.annee_fabrication) : null,
      date_mise_en_service: form.date_mise_en_service || null,
      fiche_tracabilite: form.fiche_tracabilite === 'Oui',
      prix: form.prix ? Number(form.prix) : null,
      ville: form.ville || null,
      description: form.description || null,
      vendeur_email: form.vendeur_email,
      vendeur_telephone: form.vendeur_telephone || null,
      declarations_ok: form.declarations_ok,
      photos,
    };

    let res;
    if (editId) {
      res = await supabase.from('annonces').update(payload).eq('id', editId).select().single();
    } else {
      res = await supabase.from('annonces').insert({ ...payload, user_id: user.id, statut: 'active' }).select().single();
    }
    if (res.error) { setStatus('error'); return; }

    // Numéro de série : stocké à part (privé). Ne bloque pas la publication si ça échoue.
    try {
      await supabase.from('annonce_prive').upsert({
        annonce_id: res.data.id,
        user_id: user.id,
        serial_number: form.serial_number || null,
        adresse_enlevement: form.adresse_enlevement || null,
      });
    } catch (_) {}

    router.push(`/annonces/${res.data.id}`);
  }

  if (loading) return <div className="container loading">Chargement…</div>;

  if (!user) {
    return (
      <div className="container" style={{ maxWidth: 460 }}>
        <div className="page-head">
          <h1>Déposer une annonce</h1>
          <p className="hint">Le dépôt est réservé aux professionnels connectés. La connexion se fait par un lien envoyé à votre email — sans mot de passe.</p>
        </div>
        <Link href="/compte" className="btn btn-primary">Se connecter pour déposer</Link>
      </div>
    );
  }

  const editing = Boolean(editId);

  return (
    <div className="container" style={{ maxWidth: 680 }}>
      <div className="page-head">
        <h1>{editing ? 'Modifier l’annonce' : 'Déposer une annonce'}</h1>
        <p className="hint">
          Réservé au matériel réutilisable marqué CE. Sont exclus : usage unique,
          stérile, implantable, et tout dispositif périmé ou sous rappel.
        </p>
      </div>

      <form onSubmit={submit}>
        <div className="field">
          <label>Titre *</label>
          <input required value={form.titre} onChange={(e) => update('titre', e.target.value)} placeholder="Colonne d'endoscopie Karl Storz Image1 S" />
        </div>

        <div className="form-row">
          <div className="field">
            <label>Spécialité</label>
            <select value={form.categorie_id} onChange={(e) => update('categorie_id', e.target.value)}>
              <option value="">— Choisir —</option>
              {categories.map((c) => (<option key={c.id} value={String(c.id)}>{c.nom}</option>))}
            </select>
          </div>
          <div className="field">
            <label>Type de matériel</label>
            <select value={form.type_materiel} onChange={(e) => update('type_materiel', e.target.value)}>
              <option value="">— Choisir —</option>
              {TYPES_MATERIEL.map((t) => (<option key={t} value={t}>{t}</option>))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label>Marque</label>
            <select value={form.marque} onChange={(e) => update('marque', e.target.value)}>
              <option value="">— Choisir —</option>
              {MARQUES.map((m) => (<option key={m} value={m}>{m}</option>))}
            </select>
          </div>
          <div className="field">
            <label>État</label>
            <select value={form.etat} onChange={(e) => update('etat', e.target.value)}>
              <option value="">— Choisir —</option>
              {ETATS.map((x) => (<option key={x} value={x}>{x}</option>))}
            </select>
          </div>
        </div>

        {form.marque === 'Autre / non listée' && (
          <div className="field">
            <label>Précisez la marque</label>
            <input value={form.marque_autre} onChange={(e) => update('marque_autre', e.target.value)} placeholder="Nom de la marque" />
          </div>
        )}

        <div className="form-row">
          <div className="field">
            <label>Année de fabrication</label>
            <input type="number" value={form.annee_fabrication} onChange={(e) => update('annee_fabrication', e.target.value)} placeholder="2019" />
          </div>
          <div className="field">
            <label>Date de mise en service</label>
            <input type="date" value={form.date_mise_en_service} onChange={(e) => update('date_mise_en_service', e.target.value)} />
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label>Fiche de traçabilité disponible ?</label>
            <select value={form.fiche_tracabilite} onChange={(e) => update('fiche_tracabilite', e.target.value)}>
              <option value="Non">Non</option>
              <option value="Oui">Oui</option>
            </select>
          </div>
          <div className="field">
            <label>Prix (€)</label>
            <input type="number" value={form.prix} onChange={(e) => update('prix', e.target.value)} placeholder="Laisser vide pour « à discuter »" />
          </div>
        </div>

        <div className="field">
          <label>Numéro de série (S/N)</label>
          <input value={form.serial_number} onChange={(e) => update('serial_number', e.target.value)} placeholder="Ex. 1234567-AB" />
          <p className="hint">🔒 Non affiché publiquement. Conservé pour votre traçabilité ; vous le communiquez à l'acheteur au moment de la vente.</p>
        </div>

        <div className="field">
          <label>Adresse d'enlèvement complète</label>
          <textarea value={form.adresse_enlevement} onChange={(e) => update('adresse_enlevement', e.target.value)} placeholder="12 rue… 69000 Lyon" style={{ minHeight: 60 }} />
          <p className="hint">🔒 Non affichée publiquement. Sert au transport ; communiquée à l'acheteur au moment de l'enlèvement. Seule la ville ci-dessous reste visible.</p>
        </div>

        <div className="field">
          <label>Ville (publique)</label>
          <input value={form.ville} onChange={(e) => update('ville', e.target.value)} placeholder="Lyon" />
        </div>

        <div className="field">
          <label>Description</label>
          <textarea value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="État détaillé, accessoires inclus, historique de maintenance, raison de la vente…" />
        </div>

        <div className="field">
          <label>Photos</label>
          {editing && existingPhotos.length > 0 && (
            <p className="hint">{existingPhotos.length} photo(s) déjà en ligne. En ajouter de nouvelles les complétera.</p>
          )}
          <input type="file" accept="image/*" multiple onChange={(e) => setFiles(Array.from(e.target.files))} style={{ height: 'auto', padding: 10 }} />
          <p className="hint">Facultatif, mais les annonces avec photos reçoivent bien plus de contacts.</p>
        </div>

        <div className="field">
          <label>Email de contact affiché *</label>
          <input type="email" required value={form.vendeur_email} onChange={(e) => update('vendeur_email', e.target.value)} />
          <p className="hint">Pré-rempli avec l'email de votre compte. Modifiable si vous préférez un autre contact.</p>
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
          {status === 'loading' ? (editing ? 'Enregistrement…' : 'Publication…') : (editing ? 'Enregistrer les modifications' : 'Publier l’annonce')}
        </button>
        {status === 'error' && <p className="error">Une erreur est survenue. Réessayez.</p>}
      </form>
    </div>
  );
}

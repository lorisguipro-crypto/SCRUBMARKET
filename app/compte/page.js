'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@/lib/useUser';

const STATUT_LABEL = { active: 'En ligne', vendue: 'Vendu', masquee: 'Masqué' };

export default function ComptePage() {
  const { user, loading } = useUser();
  const [email, setEmail] = useState('');
  const [authStatus, setAuthStatus] = useState('idle');
  const [annonces, setAnnonces] = useState(null); // null = en cours de chargement
  const [factures, setFactures] = useState(null); // factures reçues (en tant qu'acheteur)

  useEffect(() => {
    if (!user) { setAnnonces(null); return; }
    supabase
      .from('annonces')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setAnnonces(data || []));
  }, [user]);

  // Factures reçues en tant qu'acheteur (lecture seule — la sécurité est côté base)
  useEffect(() => {
    if (!user) { setFactures(null); return; }
    supabase
      .from('factures')
      .select('*')
      .eq('acheteur_email', user.email)
      .order('date_emission', { ascending: false })
      .then(({ data }) => setFactures(data || []));
  }, [user]);

  async function login(e) {
    e.preventDefault();
    setAuthStatus('loading');
    const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/compte` : undefined;
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
    setAuthStatus(error ? 'error' : 'sent');
  }

  async function logout() { await supabase.auth.signOut(); }

  async function changeStatut(id, statut) {
    await supabase.from('annonces').update({ statut }).eq('id', id);
    setAnnonces((a) => a.map((x) => (x.id === id ? { ...x, statut } : x)));
  }

  async function remove(id) {
    if (!confirm('Supprimer définitivement cette annonce ?')) return;
    await supabase.from('annonces').delete().eq('id', id);
    setAnnonces((a) => a.filter((x) => x.id !== id));
  }

  if (loading) return <div className="container loading">Chargement…</div>;

  // --- Non connecté : formulaire de connexion par lien magique ---
  if (!user) {
    return (
      <div className="container" style={{ maxWidth: 440 }}>
        <div className="page-head">
          <h1>Mon compte</h1>
          <p className="hint">Connexion par un lien envoyé à votre email professionnel — sans mot de passe.</p>
        </div>
        {authStatus === 'sent' ? (
          <div className="note">
            <strong>Lien envoyé.</strong> Ouvrez votre boîte email et cliquez sur le lien pour vous connecter.
            Pensez à vérifier les indésirables.
          </div>
        ) : (
          <form onSubmit={login}>
            <div className="field">
              <label>Email professionnel</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="prenom@cabinet.fr" />
            </div>
            <button className="btn btn-primary" disabled={authStatus === 'loading'}>
              {authStatus === 'loading' ? 'Envoi…' : 'Recevoir mon lien de connexion'}
            </button>
            {authStatus === 'error' && <p className="error">Une erreur est survenue. Réessayez dans un instant.</p>}
          </form>
        )}
      </div>
    );
  }

  // --- Connecté : tableau de bord ---
  return (
    <div className="container">
      <div className="page-head account-head">
        <div>
          <h1>Mon compte</h1>
          <p className="hint">{user.email}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link href="/facturation" className="btn btn-ghost btn-sm">Facturation</Link>
          <button className="btn btn-ghost btn-sm" onClick={logout}>Se déconnecter</button>
        </div>
      </div>

      <div className="section-row">
        <h2 style={{ fontSize: 20, margin: 0 }}>Mes annonces</h2>
        <Link href="/deposer" className="btn btn-primary btn-sm">Déposer une annonce</Link>
      </div>

      {annonces === null ? (
        <p className="loading">Chargement…</p>
      ) : annonces.length === 0 ? (
        <div className="empty">
          Vous n&apos;avez pas encore d&apos;annonce.{' '}
          <Link href="/deposer" style={{ color: 'var(--primary)', fontWeight: 600 }}>Déposer la première →</Link>
        </div>
      ) : (
        <div className="myads">
          {annonces.map((a) => (
            <div className="myad" key={a.id}>
              <div className="myad-main">
                <Link href={`/annonces/${a.id}`} className="myad-title">{a.titre}</Link>
                <div className="myad-meta">
                  <span>{a.prix != null ? `${a.prix} €` : 'Prix à discuter'}</span>
                  <span className={`tag tag-${a.statut}`}>{STATUT_LABEL[a.statut] || a.statut}</span>
                </div>
              </div>
              <div className="myad-actions">
                <Link href={`/deposer?id=${a.id}`} className="btn btn-ghost btn-sm">Modifier</Link>
                <Link href={`/facture/nouvelle?annonce=${a.id}`} className="btn btn-ghost btn-sm">Facture</Link>
                {a.statut === 'active' ? (
                  <button className="btn btn-ghost btn-sm" onClick={() => changeStatut(a.id, 'vendue')}>Marquer vendu</button>
                ) : (
                  <button className="btn btn-ghost btn-sm" onClick={() => changeStatut(a.id, 'active')}>Remettre en ligne</button>
                )}
                <button className="btn btn-ghost btn-sm danger" onClick={() => remove(a.id)}>Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {factures && factures.length > 0 && (
        <>
          <div className="section-row" style={{ marginTop: 44 }}>
            <h2 style={{ fontSize: 20, margin: 0 }}>Mes factures reçues</h2>
          </div>
          <div className="myads">
            {factures.map((f) => (
              <div className="myad" key={f.id}>
                <div className="myad-main">
                  <Link href={`/facture/${f.id}`} className="myad-title">Facture {f.numero}</Link>
                  <div className="myad-meta">
                    <span>{f.vendeur_raison_sociale || 'Vendeur'}</span>
                    <span>{Number(f.total || 0).toLocaleString('fr-FR')} €</span>
                  </div>
                </div>
                <div className="myad-actions">
                  <Link href={`/facture/${f.id}`} className="btn btn-ghost btn-sm">Voir / PDF</Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

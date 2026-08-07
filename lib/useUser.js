'use client';

import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

// Petit hook client : renvoie l'utilisateur connecté (ou null) et l'état de chargement.
// Écoute les changements de session (connexion via lien magique, déconnexion…).
export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  return { user, loading };
}

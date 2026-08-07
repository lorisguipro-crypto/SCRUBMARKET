-- =====================================================================
--  Factures côté acheteur — à coller dans Supabase > SQL Editor > Run
--  L'acheteur peut LIRE (jamais créer/modifier) les factures à son email.
-- =====================================================================

alter table factures add column if not exists acheteur_email text;

-- Lecture seule pour l'acheteur : une facture dont l'email destinataire
-- correspond à l'email du compte connecté. Aucune écriture possible
-- (la politique "factures owner" reste réservée au vendeur émetteur).
drop policy if exists "factures buyer read" on factures;
create policy "factures buyer read" on factures
  for select using (
    lower(acheteur_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

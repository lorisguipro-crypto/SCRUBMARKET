-- =====================================================================
--  Comptes vendeurs (lien magique) — à coller dans Supabase > SQL Editor
--  Rattache chaque annonce à un utilisateur et sécurise les accès.
-- =====================================================================

-- 1) Colonne propriétaire sur les annonces
alter table annonces add column if not exists user_id uuid references auth.users(id);

-- 2) Règles de sécurité (RLS) --------------------------------------------

-- Lecture : les annonces actives sont visibles de tous ;
-- en plus, un vendeur connecté voit toujours SES annonces (tous statuts).
drop policy if exists "annonces readable" on annonces;
create policy "annonces readable" on annonces
  for select using (statut = 'active' or auth.uid() = user_id);

-- Dépôt : réservé aux comptes connectés, l'annonce leur appartient.
drop policy if exists "annonces insertable" on annonces;
create policy "annonces insertable" on annonces
  for insert with check (auth.uid() = user_id);

-- Modification : uniquement ses propres annonces.
drop policy if exists "annonces updatable" on annonces;
create policy "annonces updatable" on annonces
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Suppression : uniquement ses propres annonces.
drop policy if exists "annonces deletable" on annonces;
create policy "annonces deletable" on annonces
  for delete using (auth.uid() = user_id);

-- 3) Upload photos par les comptes connectés -----------------------------
-- (avant, l'upload était ouvert aux anonymes ; désormais on dépose connecté)
drop policy if exists "annonces upload" on storage.objects;
create policy "annonces upload" on storage.objects
  for insert to authenticated with check (bucket_id = 'annonces');

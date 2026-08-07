-- =====================================================================
--  Annonces vendues visibles — à coller dans Supabase > SQL Editor > Run
--  Les annonces "active" ET "vendue" sont publiques ; "masquee" reste privée.
-- =====================================================================
drop policy if exists "annonces readable" on annonces;
create policy "annonces readable" on annonces
  for select using (statut in ('active', 'vendue') or auth.uid() = user_id);

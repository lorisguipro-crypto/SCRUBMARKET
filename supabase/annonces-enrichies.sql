-- =====================================================================
--  Annonces enrichies — à coller dans Supabase > SQL Editor > Run
--  Nouveaux champs publics + numéro de série privé (invisible au public)
-- =====================================================================

-- 1) Champs publics ajoutés aux annonces
alter table annonces add column if not exists marque               text;
alter table annonces add column if not exists type_materiel        text;
alter table annonces add column if not exists etat                 text;
alter table annonces add column if not exists annee_fabrication    int;
alter table annonces add column if not exists date_mise_en_service date;
alter table annonces add column if not exists fiche_tracabilite    boolean not null default false;

-- 2) Numéro de série : table SÉPARÉE, lisible uniquement par le propriétaire.
--    (ne transite jamais par l'API publique)
create table if not exists annonce_prive (
  annonce_id     uuid primary key references annonces(id) on delete cascade,
  user_id        uuid not null references auth.users(id),
  serial_number  text
);

alter table annonce_prive enable row level security;

drop policy if exists "prive select owner" on annonce_prive;
create policy "prive select owner" on annonce_prive
  for select using (auth.uid() = user_id);

drop policy if exists "prive insert owner" on annonce_prive;
create policy "prive insert owner" on annonce_prive
  for insert with check (auth.uid() = user_id);

drop policy if exists "prive update owner" on annonce_prive;
create policy "prive update owner" on annonce_prive
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "prive delete owner" on annonce_prive;
create policy "prive delete owner" on annonce_prive
  for delete using (auth.uid() = user_id);

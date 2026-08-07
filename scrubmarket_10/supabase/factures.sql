-- =====================================================================
--  Factures vendeur — à coller dans Supabase > SQL Editor > Run
--  1 profil de facturation par vendeur + table des factures émises.
--  Tout est privé : lisible uniquement par le vendeur propriétaire.
-- =====================================================================

-- 1) Infos de facturation du vendeur (remplies une fois dans "Mon compte")
create table if not exists profil_facturation (
  user_id                 uuid primary key references auth.users(id),
  raison_sociale          text,
  adresse                 text,
  siret                   text,
  mentions_complementaires text,        -- forme juridique, capital, RCS, TVA intracom…
  mention_tva             text,         -- ex. "TVA non applicable, art. 293 B du CGI"
  updated_at              timestamptz not null default now()
);

alter table profil_facturation enable row level security;
drop policy if exists "profilfact owner" on profil_facturation;
create policy "profilfact owner" on profil_facturation
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 2) Factures émises (numéro séquentiel par vendeur, données figées à l'émission)
create table if not exists factures (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references auth.users(id),
  numero                 text not null,
  date_emission          date not null default now(),
  annonce_id             uuid references annonces(id) on delete set null,
  -- vendeur (figé au moment de l'émission)
  vendeur_raison_sociale text,
  vendeur_adresse        text,
  vendeur_siret          text,
  vendeur_mentions       text,
  -- acheteur
  acheteur_nom           text,
  acheteur_adresse       text,
  acheteur_siret         text,
  -- ligne
  designation            text,
  quantite               int not null default 1,
  prix_unitaire          numeric not null default 0,
  total                  numeric not null default 0,
  mention_tva            text,
  created_at             timestamptz not null default now()
);

alter table factures enable row level security;
drop policy if exists "factures owner" on factures;
create policy "factures owner" on factures
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

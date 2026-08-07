-- =====================================================================
--  Marketplace DM d'occasion — schéma de base (MVP de test de demande)
--  À coller dans : Supabase > SQL Editor > New query > Run
-- =====================================================================

-- 1) TABLES ------------------------------------------------------------

create table if not exists categories (
  id    bigint generated always as identity primary key,
  nom   text not null,
  slug  text unique not null
);

create table if not exists annonces (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  titre              text not null,
  description        text,
  prix               numeric,
  ville              text,
  categorie_id       bigint references categories(id),
  photos             text[] not null default '{}',
  vendeur_email      text not null,
  vendeur_telephone  text,
  -- déclaration de conformité du vendeur : on l'exige dès le MVP
  declarations_ok    boolean not null default false,
  statut             text not null default 'active'   -- active | masquee | vendue
);

create table if not exists contacts (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  annonce_id    uuid references annonces(id) on delete cascade,
  acheteur_nom  text,
  acheteur_email text not null,
  message       text
);

-- Capture d'email sur la page d'accueil ("prévenez-moi au lancement")
create table if not exists leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  email       text not null
);

-- 2) CATÉGORIES DE DÉPART ---------------------------------------------

insert into categories (nom, slug) values
  ('Endoscopie',          'endoscopie'),
  ('Gynécologie',         'gynecologie'),
  ('Urologie',            'urologie'),
  ('Imagerie',            'imagerie'),
  ('Bloc opératoire',     'bloc-operatoire'),
  ('Mobilier & cabinet',  'mobilier-cabinet')
on conflict (slug) do nothing;

-- 3) SÉCURITÉ (Row Level Security) ------------------------------------
--    Lecture publique des annonces actives et des catégories.
--    Insertions ouvertes (MVP). Les contacts et leads ne sont PAS
--    lisibles publiquement : tu les consultes depuis le dashboard.

alter table categories enable row level security;
alter table annonces   enable row level security;
alter table contacts   enable row level security;
alter table leads      enable row level security;

drop policy if exists "categories readable" on categories;
create policy "categories readable" on categories
  for select using (true);

drop policy if exists "annonces readable" on annonces;
create policy "annonces readable" on annonces
  for select using (statut = 'active');

drop policy if exists "annonces insertable" on annonces;
create policy "annonces insertable" on annonces
  for insert with check (true);

drop policy if exists "contacts insertable" on contacts;
create policy "contacts insertable" on contacts
  for insert with check (true);

drop policy if exists "leads insertable" on leads;
create policy "leads insertable" on leads
  for insert with check (true);

-- 4) STOCKAGE DES PHOTOS ----------------------------------------------
--    D'abord créer un bucket PUBLIC nommé "annonces"
--    (Supabase > Storage > New bucket > Public). Puis, si l'upload
--    échoue, exécuter ces deux règles :

drop policy if exists "annonces upload" on storage.objects;
create policy "annonces upload" on storage.objects
  for insert to anon with check (bucket_id = 'annonces');

drop policy if exists "annonces public read" on storage.objects;
create policy "annonces public read" on storage.objects
  for select using (bucket_id = 'annonces');

-- =====================================================================
--  Adresse d'enlèvement (privée) — à coller dans Supabase > SQL Editor > Run
--  Stockée dans annonce_prive : lisible uniquement par le vendeur.
-- =====================================================================
alter table annonce_prive add column if not exists adresse_enlevement text;

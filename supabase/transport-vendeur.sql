-- =====================================================================
--  Transport indiqué par le vendeur — à coller dans Supabase > SQL Editor
--  Poids et type d'envoi renseignés au dépôt (publics : utiles à l'acheteur).
-- =====================================================================
alter table annonces add column if not exists poids_kg        numeric;
alter table annonces add column if not exists type_transport  text;   -- 'standard' | 'palette'

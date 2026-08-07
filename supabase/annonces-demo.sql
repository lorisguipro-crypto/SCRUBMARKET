-- =====================================================================
--  10 annonces de démonstration — à coller dans Supabase > SQL Editor > Run
--  Rattachées à ton compte via l'email loris2210@live.fr.
--  ⚠️ Connecte-toi AU MOINS UNE FOIS sur le site avec loris2210@live.fr
--     AVANT de lancer ce script (pour que le compte existe et que les
--     annonces apparaissent dans "Mes annonces"). Sinon elles seront
--     visibles publiquement mais non rattachées à ton tableau de bord.
-- =====================================================================

insert into annonces
  (titre, description, prix, ville, categorie_id, photos, vendeur_email,
   declarations_ok, statut, user_id, marque, type_materiel, etat,
   annee_fabrication, date_mise_en_service, fiche_tracabilite)
values
 ('Colonne d''endoscopie Olympus CV-190',
  'Colonne vidéo complète Olympus (processeur CV-190 + source lumineuse CLV-190). Révisée, en excellent état de fonctionnement. Idéale pour gastro/coloscopie. Cause : renouvellement de parc.',
  12400,'Lyon',(select id from categories where slug='endoscopie'),
  array['https://images.unsplash.com/photo-1640876777012-bdb00a6323e2?auto=format&fit=crop&w=1200&q=80'],
  'loris2210@live.fr',true,'active',
  (select id from auth.users where email='loris2210@live.fr'),
  'Olympus','Colonne / tour vidéo','Très bon',2019,'2019-03-01',true),

 ('Colonne d''arthroscopie Arthrex Synergy HD3',
  'Colonne d''arthroscopie Arthrex Synergy HD3, caméra haute définition. Utilisée en chirurgie du genou et de l''épaule. Bon état général, quelques traces d''usage.',
  9800,'Villeurbanne',(select id from categories where slug='bloc-operatoire'),
  array['https://images.unsplash.com/photo-1640876777002-badf6aee5bcc?auto=format&fit=crop&w=1200&q=80'],
  'loris2210@live.fr',true,'active',
  (select id from auth.users where email='loris2210@live.fr'),
  'Arthrex','Colonne / tour vidéo','Bon',2018,'2018-06-01',true),

 ('Bistouri électrique Erbe VIO 300D',
  'Générateur électrochirurgical Erbe VIO 300D, monopolaire et bipolaire. Maintenance à jour, très peu servi. Livré avec pédale.',
  6500,'Lyon',(select id from categories where slug='bloc-operatoire'),
  array['https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&w=1200&q=80'],
  'loris2210@live.fr',true,'active',
  (select id from auth.users where email='loris2210@live.fr'),
  'Erbe','Générateur / bistouri électrique','Très bon',2020,'2020-02-01',true),

 ('Échographe GE Voluson E8',
  'Échographe GE Voluson E8 pour gynécologie-obstétrique, imagerie 4D. Deux sondes incluses (abdominale + endovaginale). Bon état, écran impeccable.',
  18500,'Lyon',(select id from categories where slug='gynecologie'),
  array['https://images.unsplash.com/photo-1576671414121-aa0c81c869e1?auto=format&fit=crop&w=1200&q=80'],
  'loris2210@live.fr',true,'active',
  (select id from auth.users where email='loris2210@live.fr'),
  'GE Healthcare','Échographe','Bon',2017,'2017-09-01',false),

 ('Colonne d''urologie Karl Storz Image1',
  'Colonne d''endoscopie urologique Karl Storz Image1 S. Parfaite pour cystoscopie et RTUV. Optiques non incluses. Révisée récemment.',
  14200,'Bron',(select id from categories where slug='urologie'),
  array['https://images.unsplash.com/photo-1640876777012-bdb00a6323e2?auto=format&fit=crop&w=1200&q=80'],
  'loris2210@live.fr',true,'active',
  (select id from auth.users where email='loris2210@live.fr'),
  'Karl Storz','Colonne / tour vidéo','Très bon',2019,'2019-05-01',true),

 ('Table d''opération Trumpf Mars',
  'Table d''opération électrohydraulique Trumpf Mars, télécommande fonctionnelle, plateau modulable. Bon état, idéale pour bloc polyvalent.',
  7200,'Lyon',(select id from categories where slug='bloc-operatoire'),
  array['https://images.unsplash.com/photo-1640876777002-badf6aee5bcc?auto=format&fit=crop&w=1200&q=80'],
  'loris2210@live.fr',true,'active',
  (select id from auth.users where email='loris2210@live.fr'),
  'Trumpf Medical','Table d''opération','Bon',2016,'2016-04-01',false),

 ('Éclairage opératoire Dräger Polaris 600',
  'Scialytique Dräger Polaris 600, deux coupoles LED. Excellent flux lumineux, bras équilibrés. Démontage et notice fournis.',
  5400,'Vénissieux',(select id from categories where slug='bloc-operatoire'),
  array['https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&w=1200&q=80'],
  'loris2210@live.fr',true,'active',
  (select id from auth.users where email='loris2210@live.fr'),
  'Dräger','Éclairage opératoire','Très bon',2019,'2019-07-01',true),

 ('Fauteuil d''examen gynécologique électrique',
  'Fauteuil d''examen gynécologique à hauteur variable électrique, sellerie en bon état. Étriers inclus. Parfait pour cabinet de ville.',
  2600,'Lyon',(select id from categories where slug='mobilier-cabinet'),
  array['https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&w=1200&q=80'],
  'loris2210@live.fr',true,'active',
  (select id from auth.users where email='loris2210@live.fr'),
  'Autre','Fauteuil / table d''examen','Bon',2018,'2018-01-01',false),

 ('Microscope opératoire Carl Zeiss OPMI Vario',
  'Microscope opératoire Carl Zeiss OPMI Vario sur statroute S7. Optique impeccable, idéal ORL / neuro. Révisé, prêt à l''emploi.',
  21000,'Lyon',(select id from categories where slug='bloc-operatoire'),
  array['https://images.unsplash.com/photo-1640876777002-badf6aee5bcc?auto=format&fit=crop&w=1200&q=80'],
  'loris2210@live.fr',true,'vendue',
  (select id from auth.users where email='loris2210@live.fr'),
  'Carl Zeiss','Microscope opératoire','Très bon',2015,'2015-10-01',true),

 ('Arceau mobile de radioscopie Philips BV Endura',
  'Amplificateur de brillance mobile Philips BV Endura, idéal orthopédie et vasculaire. Fonctionnel, quelques heures d''usage modérées.',
  16500,'Lyon',(select id from categories where slug='imagerie'),
  array['https://images.unsplash.com/photo-1576671414121-aa0c81c869e1?auto=format&fit=crop&w=1200&q=80'],
  'loris2210@live.fr',true,'vendue',
  (select id from auth.users where email='loris2210@live.fr'),
  'Philips','Arceau / imagerie mobile (C-arm)','Bon',2014,'2014-11-01',false);

-- ---------------------------------------------------------------------
-- Adresse d'enlèvement (privée) pour les annonces de démo.
-- Nécessite que la colonne existe déjà (script adresse-enlevement.sql / SQL regroupé).
-- ---------------------------------------------------------------------
insert into annonce_prive (annonce_id, user_id, adresse_enlevement)
select id, user_id, 'Clinique du Parc — 155 boulevard de Stalingrad, 69006 Lyon'
from annonces
where vendeur_email = 'loris2210@live.fr'
on conflict (annonce_id) do update set adresse_enlevement = excluded.adresse_enlevement;

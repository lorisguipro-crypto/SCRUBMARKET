// Catalogue de marques de dispositifs médicaux (liste éditable).
export const MARQUES = [
  'Abbott', 'Aesculap', 'Alcon', 'Ambu', 'Arthrex', 'B. Braun', 'Bausch + Lomb',
  'Baxter', 'Boston Scientific', 'Canon Medical', 'Carl Zeiss', 'Coloplast',
  'ConMed', 'Cook Medical', 'Dentsply Sirona', 'DePuy Synthes', 'Dräger',
  'Edwards Lifesciences', 'Erbe', 'Ethicon (J&J)', 'Fresenius', 'Fujifilm',
  'GE Healthcare', 'Getinge / Maquet', 'Hamilton Medical', 'Heine', 'Hologic',
  'Intuitive (da Vinci)', 'Karl Storz', 'KaVo', 'Leica', 'Medtronic', 'Mindray',
  'NSK', 'Olympus', 'Pentax Medical', 'Philips', 'Richard Wolf',
  'Siemens Healthineers', 'Smith & Nephew', 'Steris', 'Stryker', 'Teleflex',
  'Terumo', 'Trumpf Medical', 'Vygon', 'Welch Allyn / Hillrom', 'Zimmer Biomet',
  'Autre / non listée',
];

// Types de matériel (transversal aux spécialités).
export const TYPES_MATERIEL = [
  'Colonne / tour vidéo', 'Endoscope / optique', 'Moniteur / scope patient',
  'Échographe', 'Générateur / bistouri électrique', 'Table d’opération',
  'Éclairage opératoire', 'Microscope opératoire', 'Pompe / injecteur',
  'Respirateur / ventilateur', 'Stérilisateur / autoclave',
  'Instrumentation chirurgicale', 'Fauteuil / table d’examen', 'Mobilier médical',
  'Arceau / imagerie mobile (C-arm)', 'Laser médical', 'Défibrillateur / moniteur',
  'Autre',
];

export const ETATS = ['Neuf', 'Très bon', 'Bon', 'À réviser'];

// Fourchettes de prix pour le filtre (label, min, max)
export const FOURCHETTES_PRIX = [
  { label: 'Moins de 1 000 €', min: 0, max: 1000 },
  { label: '1 000 – 5 000 €', min: 1000, max: 5000 },
  { label: '5 000 – 20 000 €', min: 5000, max: 20000 },
  { label: 'Plus de 20 000 €', min: 20000, max: Infinity },
];

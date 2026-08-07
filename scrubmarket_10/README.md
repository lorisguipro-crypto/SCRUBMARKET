# ScrubMarket — MVP marketplace de matériel médical d'occasion

Un squelette **Next.js + Supabase** pour tester la demande d'une place de marché
de matériel médical d'occasion entre professionnels (« le Leboncoin du médical »).

> **Ce que c'est** : un test de demande. On rend réel ce qui se voit (déposer,
> parcourir, contacter) et on laisse volontairement de côté ce qui coûte cher et
> se justifie seulement une fois la demande prouvée : paiement, KYC, messagerie
> interne, modération automatique.

---

## Les 5 pages

| Page | Chemin | Rôle |
|------|--------|------|
| Accueil | `/` | Proposition de valeur + capture d'email |
| Parcourir | `/annonces` | Grille + filtre spécialité / prix max |
| Détail | `/annonces/[id]` | Photos, description, contact vendeur |
| Déposer | `/deposer` | Formulaire + déclaration de conformité |
| Compte | `/compte` | Connexion par lien magique (facultatif) |

Tables : `annonces`, `categories`, `contacts` (demandes acheteurs), `leads`
(emails de la page d'accueil).

---

## Mise en route (≈ 15 min)

### Prérequis
- **Node.js 18+** installé ([nodejs.org](https://nodejs.org))
- Un compte **Supabase** gratuit ([supabase.com](https://supabase.com))

### 1. Créer le projet Supabase
Sur supabase.com → **New project**. Note le mot de passe de la base, attends
que le projet finisse de démarrer.

### 2. Créer les tables
Supabase → **SQL Editor** → **New query** → colle tout le contenu de
`supabase/schema.sql` → **Run**. Ça crée les tables, les catégories de départ
et les règles de sécurité.

### 3. Créer le stockage des photos
Supabase → **Storage** → **New bucket** → nom exact `annonces` → coche
**Public** → créer. (Les règles d'upload sont déjà dans `schema.sql`.)

### 4. Récupérer les clés
Supabase → **Project Settings** → **API**. Tu as besoin de deux valeurs :
- **Project URL**
- **anon / public key**

Copie `.env.local.example` en `.env.local` et remplis-les :
```bash
cp .env.local.example .env.local
```
```
NEXT_PUBLIC_SUPABASE_URL=https://tonprojet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### 5. Lancer en local
```bash
npm install
npm run dev
```
Ouvre **http://localhost:3000**.

---

## Amorcer avec de vraies annonces

Une marketplace vide ne teste rien. **Avant de partager le lien**, va sur
`/deposer` et publie toi-même 10 à 20 annonces réelles issues de ton réseau
(blocs, cabinets, revendeurs qui déstockent). C'est normal : on amorce l'offre
à la main, on ne l'attend pas.

## Où lire tes contacts et tes emails
Les demandes acheteurs et les emails collectés ne sont pas visibles sur le site
(volontairement). Tu les consultes dans Supabase → **Table Editor** →
`contacts` et `leads`.

---

## Mettre en ligne (gratuit) — Vercel
1. Pousse le dossier sur un dépôt GitHub.
2. [vercel.com](https://vercel.com) → **Add New Project** → importe le dépôt.
3. Dans **Environment Variables**, remets `NEXT_PUBLIC_SUPABASE_URL` et
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. **Deploy**. Branche ton nom de domaine ensuite.

---

## Ce qui n'est PAS construit (et quand l'ajouter)

| Brique | Pourquoi plus tard | Quand |
|--------|--------------------|-------|
| Paiement (Stripe Connect) | Coûteux en temps, inutile tant que la demande n'est pas prouvée | Quand des transactions se concluent régulièrement à la main |
| Vérification pros (KYC) | Idem — se fait à la main au début | Au passage au transactionnel |
| Messagerie interne | Le contact par email suffit à mesurer l'intérêt | Quand le volume de contacts le justifie |
| CGU / CGV / RGPD sur-mesure | Modèles suffisants pour un test | **Avant** d'activer le paiement — voir la trame avocat |

## Rappels importants (même en test)
- **Exclus du catalogue** : usage unique, stérile, implantable, DMDIV, périmé,
  sous rappel. Le formulaire l'affiche, mais c'est à toi de modérer.
- La **déclaration de conformité** du vendeur est obligatoire à chaque dépôt :
  garde ce réflexe, c'est le cœur de ton modèle « pur intermédiaire ».

---

*Marque « ScrubMarket » — à vérifier (domaine + INPI/EUIPO) avant communication publique.*

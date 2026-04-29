# Design — i18n centralisee du site public et du wizard Dok'peyi

Date : 2026-04-25
Branche cible : `claude/create-website-AhMOy`
Perimetre : site public + wizard
Hors perimetre : `admin/`, documents generes, SEO invisible (`title`, `meta`, OG, Twitter, JSON-LD), endpoints `api/`

## 1. Objectif

Rendre traduisible l'ensemble des textes visibles a l'ecran sur le site public Dok'peyi et sur le wizard client, en s'appuyant sur une i18n centralisee. La langue selectionnee doit mettre a jour toute l'interface client sans toucher a la logique metier ni au contenu des documents generes.

La cible produit est une experience premium, homogene et sans melange de langues. A l'etat termine, aucun texte visible cote client ne doit rester code en dur en francais dans les pages publiques ou dans le wizard.

## 2. Contexte actuel

Le projet dispose deja d'un systeme multilingue base sur `lang.js` et `lang.css`, avec une couverture importante de `a-propos.html`. En revanche, la couverture est inegale sur le reste du site :

- certaines pages publiques sont partiellement ou totalement en dur
- le wizard contient beaucoup de textes injectes depuis `service.js`
- le changement de langue ne garantit pas aujourd'hui la mise a jour de tous les blocs dynamiques deja affiches

Le chantier doit donc consolider l'existant au lieu d'introduire un second systeme.

## 3. Decision d'architecture

L'architecture retenue est une i18n centralisee complete.

- `lang.js` devient la source unique de tous les textes visibles a l'ecran
- les textes HTML statiques utilisent `data-i18n` ou `data-i18n-html`
- les textes dynamiques injectes depuis JavaScript utilisent des cles i18n resolues a l'execution
- les identifiants metier restent stables et non traduits
- seule la couche d'affichage varie selon la langue active

Cette architecture est choisie pour garantir :

- une maintenance simple
- un comportement coherent sur tout le site
- l'absence de doublons de traduction
- une separation nette entre logique metier et textes d'interface

## 4. Perimetre exact

### Inclus

- `index.html`
- `service.html`
- `service.js`
- `a-propos.html`
- `mentions-legales.html`
- `cgv.html`
- `confidentialite.html`
- `cookies.html`
- `404.html`
- `cv-catalogue.html`
- `lang.js`
- `lang.css` si des ajustements d'affichage sont necessaires au bouton langue ou aux textes traduits

### Exclus

- `admin/`
- contenu des documents generes par l'IA
- prompts de generation
- routes `api/`
- contenu SEO non visible

## 5. Regles de conception

### 5.1 Identifiants metier

Les valeurs metier ne changent jamais avec la langue. Exemple :

- services : `cv`, `lettre`, `courrier`, `dossier`, `sejour`, `impot`, `naturalisation`
- sous-types : `scratch`, `improve`, `pro`, `create`, `adapt`, etc.

Ces identifiants continuent a piloter la logique. Les libelles visibles associes sont traduits via l'i18n.

### 5.2 Source unique des textes

Tous les textes visibles a l'ecran doivent provenir de `lang.js`, y compris :

- navigation
- boutons
- labels
- placeholders
- titres et sous-titres
- textes d'etat
- messages d'erreur
- confirmations
- libelles des options visibles
- textes du panneau de modification du wizard

### 5.3 Re-render au changement de langue

Le changement de langue doit mettre a jour :

- la page courante
- la navigation
- les blocs deja injectes par JS
- les etapes, labels et etats du wizard

Un changement de langue ne doit pas exiger un rechargement manuel pour afficher la bonne version du texte visible.

## 6. Organisation des cles

Le dictionnaire sera organise par namespaces.

### 6.1 Commun

- `common.nav.*`
- `common.footer.*`
- `common.cta.*`
- `common.lang.*`
- `common.errors.*`

### 6.2 Par page

- `index.*`
- `service.*`
- `a_propos.*`
- `mentions_legales.*`
- `cgv.*`
- `confidentialite.*`
- `cookies.*`
- `not_found.*`
- `cv_catalogue.*`

### 6.3 Wizard

Le namespace `service.*` couvrira notamment :

- hero du wizard
- barre de progression
- etapes 1 a 4
- labels et placeholders
- textes d'aide
- titres et descriptions des choix
- etats de chargement
- panneau de modification
- recap paiement
- messages de succes, attente, blocage et erreur visibles a l'ecran

## 7. Strategy de migration par surface

### 7.1 Bloc fondation

Objectif : fiabiliser l'i18n existante sans toucher a la logique metier.

Travaux prevus :

- consolider `lang.js` comme dictionnaire central
- ajouter ou clarifier les helpers de resolution de cles pour le JavaScript dynamique
- verifier la persistence de la langue choisie
- verifier l'injection du bouton langue dans les zones de navigation concernees

### 7.2 Bloc pages publiques statiques

Objectif : convertir l'ensemble du site public HTML visible.

Travaux prevus :

- marquer les textes statiques avec `data-i18n` ou `data-i18n-html`
- sortir les textes en dur vers `lang.js`
- verifier page par page qu'aucun texte visible oublie ne subsiste

### 7.3 Bloc wizard

Objectif : rendre le wizard integralement traduisible sans modifier son comportement metier.

Travaux prevus :

- extraire toutes les chaines visibles de `service.js`
- remplacer les chaines en dur par des appels de type `t('service.xxx')`
- rendre traduisibles les structures injectees dynamiquement :
  - choix de services
  - etapes
  - champs
  - placeholders
  - messages de validation et d'erreur
  - chargement
  - recap paiement
  - panneau de modification
- garantir le re-render des blocs deja affiches lorsqu'on change de langue en cours de parcours

## 8. Fichiers impactes a terme

### Fondations i18n

- `lang.js`
- potentiellement `lang.css`

### Pages publiques

- `index.html`
- `a-propos.html`
- `mentions-legales.html`
- `cgv.html`
- `confidentialite.html`
- `cookies.html`
- `404.html`
- `cv-catalogue.html`

### Wizard

- `service.html`
- `service.js`

## 9. Contraintes de non-regression

- aucun changement de logique metier
- aucun changement de parcours de paiement
- aucun changement des contenus generes
- aucun changement dans `admin/`
- aucun changement dans les endpoints `api/`
- aucun texte d'interface remplace par une cle brute visible
- aucun bouton ou libelle vide
- aucun melange de deux langues sur une meme vue

## 10. Definition du "termine"

Le chantier sera considere termine quand les conditions suivantes seront remplies :

1. Toutes les pages publiques du site affichent uniquement des textes traduisibles via la langue selectionnee.
2. Le wizard affiche uniquement des textes traduisibles via la langue selectionnee.
3. Un changement de langue met a jour la vue courante sans laisser de texte visible oublie.
4. Les textes visibles du wizard injectes depuis `service.js` sont tous pilotes par l'i18n.
5. Les documents generes restent exclus du mecanisme et ne sont pas modifies.

## 11. Risques identifies

### 11.1 Risque principal

Le risque principal est `service.js`, qui concentre beaucoup de texte d'interface et de rendu dynamique.

Mesure retenue :

- isoler les chaines visibles
- conserver strictement la logique metier
- avancer par zones coherentes plutot que par remplacement massif aveugle

### 11.2 Risque d'incoherence produit

Le site pourrait temporairement afficher des ecrans partiellement traduits si le chantier est mene sans ordre.

Mesure retenue :

- ordre d'execution strict : fondation -> pages publiques -> wizard

### 11.3 Risque de conflit avec travail parallele

Les zones `admin/` et certaines surfaces recentes du repo ont bouge ces derniers jours.

Mesure retenue :

- exclure `admin/`
- concentrer ce chantier sur les fichiers publics et le systeme i18n
- resynchroniser le clone avant toute implementation reelle

## 12. Strategie de verification

La verification de l'implementation devra couvrir au minimum :

- controle page par page des textes visibles
- verification du switch de langue sur la page courante
- verification du wizard en cours de parcours
- verification des etats dynamiques deja affiches
- verification de l'absence de textes FR residuels visibles

Une recherche code ne suffira pas a elle seule : la validation devra aussi etre visuelle et fonctionnelle.

## 13. Recommandation finale

Le chantier doit etre execute en une seule strategie coherente, avec `lang.js` comme source unique et `service.js` traite comme surface speciale. Cette approche est la seule suffisamment robuste pour atteindre l'objectif produit fixe : une experience client premium, integralement traduisible a l'ecran, sans toucher ni a l'admin ni aux documents generes.

# Dok'péyi — Documentation technique

## Instructions Claude Code — OBLIGATOIRE
Ces règles s'appliquent à CHAQUE session sans exception.

### En début de session
1. Lire ce fichier CLAUDE.md en entier
2. Vérifier que le contenu correspond à l'état réel du code
3. Si écart détecté → corriger CLAUDE.md avant toute action

### En fin de session (avant chaque commit)
1. Mettre à jour CLAUDE.md pour refléter les changements effectués :
   - Nouveaux fichiers créés → ajouter dans Architecture
   - Nouveaux services → ajouter dans Services disponibles
   - Variables d'env ajoutées → ajouter dans Variables
   - Roadmap avancée → mettre à jour le statut
2. Le commit de CLAUDE.md doit accompagner chaque commit de code
3. Ne jamais committer du code sans mettre à jour CLAUDE.md

### Règle absolue
Si CLAUDE.md n'est pas à jour → ne pas committer.

## Stack technique
- Frontend : HTML/CSS/JS vanilla, zéro framework
- Runtime : Vercel Edge Functions (`export const config = { runtime: 'edge' }`)
- IA : Anthropic API (`CLAUD_API_KEY`) + OpenAI (`OPENAI_API_KEY`)
- Modèle utilisé partout : `claude-haiku-4-5-20251001`
- DB : Firebase Realtime Database EU-west1
- Email : Resend API
- Paiement : Stripe Checkout + webhook HMAC-SHA256 + Mobile Money (Momo) + PayPal manuel
- Tests : `node --test` natif (pas de framework externe), 229 tests / 73 suites
- CI : GitHub Actions (`ci.yml`, `tests.yml`, `secret-scan.yml`)
- Zéro dépendance npm (`package.json` ne contient que `"type": "module"` et le script test)

## Variables d'environnement requises
| Variable | Service | Où obtenir la valeur | Obligatoire |
|---|---|---|---|
| `CLAUD_API_KEY` | Anthropic — génération documents (attention : sans le E final) | console.anthropic.com | Oui |
| `OPENAI_API_KEY` | OpenAI — chat IA équipe (fallback) | platform.openai.com | Oui |
| `RESEND_API_KEY` | Emails transactionnels | resend.com | Oui |
| `EMAIL_FROM` | Adresse expéditeur emails | Configuration Resend | Oui |
| `EMAIL_ADMIN` | Destinataire notifications internes | Adresse équipe | Oui |
| `STRIPE_SECRET_KEY` | Paiement Stripe | dashboard.stripe.com | Oui |
| `STRIPE_WEBHOOK_SECRET` | Vérification signature webhook Stripe | Stripe → Webhooks → endpoint | Oui |
| `DOK_WEBHOOK_SECRET` | Webhook interne | À générer (openssl rand -hex 32) | Oui |
| `MOMO_CALLBACK_TOKEN` | Authentification callback Mobile Money | Opérateur Momo | Oui |
| `FIREBASE_DATABASE_URL` | Firebase Realtime DB (URL EU-west1) | Firebase console | Oui |
| `NEXT_PUBLIC_BASE_URL` | CORS origin (`https://dok-peyi.vercel.app`) | URL déploiement Vercel | Oui |
| `ADMIN_PASS_ALLAN` | Mot de passe admin Allan | Générer (≥16 caractères) | Oui |
| `ADMIN_PASS_YONEL` | Mot de passe admin Yonel | Générer (≥16 caractères) | Oui |
| `ADMIN_PASS_MARVIN` | Mot de passe admin Marvin | Générer (≥16 caractères) | Oui |
| `ADMIN_PASS_REDAC` | Mot de passe agent Rédac | Générer (≥16 caractères) | Oui |

Note : `PAYPAL_EMAIL` n'est PAS une variable d'environnement. L'adresse PayPal Business est hardcodée dans `service.js` (constante `PAYPAL_EMAIL = 'contact@dok-peyi.fr'`).

## Architecture

### Flow client (wizard)
```
index.html (landing)
    ↓
service.html + service.js (wizard 3 étapes : service → infos → paiement)
    ↓
    ├─ POST /api/extract-doc      (si import document : pré-remplissage auto)
    ↓
    ├─ POST /api/generate-cv      (génération document HTML via Claude streaming)
    ↓ iframe srcdoc (prévisualisation)
    ├─ Panneau modif section      (universel tous services hors 'improve',
    │                              FREE_MODIFICATIONS = 2, sections par service
    │                              via MODIFY_SECTIONS, versions historisées)
    ↓
    ├─ POST /api/create-checkout  (Stripe) OU paiement PayPal/Momo manuel
    ↓ redirection Stripe Checkout
    ├─ POST /api/payment-webhook  (callback signé HMAC)
    ↓
    └─ email livraison via /api/send-email (Resend)
```

### Flow admin
```
admin/index.html
    ↓
POST /api/admin-auth (brute-force protection, 5 tentatives max)
    ↓
workspace-* (projets, tâches, chat, IA, QC, agents, notes, dashboard)
    ↓
    ├─ POST /api/ai-chat          (assistant IA équipe — Claude ou GPT)
    ├─ POST /api/redac-chat       (agent Rédac — supervision dossiers, #ID)
    └─ POST /api/pipeline         (transitions d'états : generate / confirm_payment /
                                   deliver / fail / get_document)
```

### Edge Functions (répertoire `api/`)
| Fichier | Rôle |
|---|---|
| `api/orchestrate.js` | Pipeline multi-agents serveur — Emma → Viktor (éval, max 2 boucles) → Sofia → Léa, rate-limit 5/min. Emma : Opus (séjour/naturalisation) ou Sonnet (autres). Viktor/Sofia/Léa : Haiku. Retourne `{ cv: "…" }` |
| `api/generate-cv.js` | Génération document principal — streaming SSE Anthropic, rate-limit 5/min, max prompt 32k car, max systemPrompt 4k car |
| `api/ai-chat.js` | Chat IA interne équipe (Claude ou OpenAI selon `service`), historique 10 derniers messages |
| `api/redac-chat.js` | Agent Rédac — assistant interne, anti-injection + actions destructives bloquées |
| `api/pipeline.js` | Orchestration transitions — `generate`/`confirm_payment`/`deliver`/`fail`/`get_document` |
| `api/payment-webhook.js` | Webhook Stripe + Momo — vérification HMAC-SHA256 |
| `api/create-checkout.js` | Création session Stripe Checkout |
| `api/send-email.js` | Envoi emails transactionnels via Resend |
| `api/extract-doc.js` | OCR/extraction JSON depuis PDF ou image (pré-remplissage wizard) |
| `api/admin-auth.js` | Authentification admin serveur + rate-limit anti-brute-force |
| `api/suggest.js` | Suggestions IA temps réel pour champs CV — POST `{ field, poste, context? }`, fields acceptés : `accroche / missions / competences / interets / certifications / infos_complementaires`, normalisation `missions_N → missions` côté serveur, rate-limit 10/min/IP, modèle Haiku, max_tokens 800, retourne `{ suggestions: string[] }`. Volumes : 6 accroches, 8 missions, 12 compétences, 8 intérêts, 6 certifications, 5 infos. Prompts retournent un tableau JSON direct. Nettoyage markdown avant `JSON.parse`. |

### Modules `lib/`
| Fichier | Rôle |
|---|---|
| `lib/content.js` | Prompt builders par service + parseContent (mode `json` ou `html`) |
| `lib/pipeline.js` | Stage handlers backend (graphe transitions, `generate`, `confirm_payment`, `deliver`, `fail`) |
| `lib/templates.js` | Rendering structuré (JSON → HTML A4 CSS-inline) |
| `lib/documents.js` | Contrôle d'accès aux documents selon statut (`preview` vs `final`) |
| `lib/statuses.js` | Miroir navigateur du graphe de transitions |
| `lib/review.js` | Règles de review admin (pré-paiement / post-paiement) |
| `lib/rate-limit.js` | Fenêtre glissante en mémoire, par IP |
| `lib/edge-response.js` | Helpers CORS + `json()` partagés par toutes les Edge Functions |
| `lib/services/sejour.js` | Builder prompt dédié titre de séjour |
| `lib/services/impot.js` | Builder prompt dédié avis d'impôt |
| `lib/services/naturalisation.js` | Builder prompt dédié naturalisation |

### Autres fichiers clés
| Fichier | Rôle |
|---|---|
| `service.js` | Wizard client — logique complète, constantes `CV_TEMPLATES`, `MODIFY_SECTIONS`, `CV_POSTES_GROUPS`, `CV_DIPLOMES_GROUPS`, `CV_COMPETENCES_GROUPS`, `LETTRE_ENTREPRISES_GROUPS`, `LETTRE_SECTEUR_TAGS`, `COURRIER_DESTINATAIRES_GROUPS`, `COURRIER_OBJET_TYPES`, `DOSSIER_CAF_PRESTATIONS`, `DOSSIER_CAF_SITUATION_PRO`, `DOSSIER_CAF_FOYER`, `DOSSIER_LOGEMENT_TYPES`, `DOSSIER_LOGEMENT_SITUATIONS`, `DOSSIER_AIDE_TYPES`, `DOSSIER_AIDE_ORGANISMES`, `SEJOUR_NATIONALITES`, `SEJOUR_SITUATION_FAMILIALE`, `SEJOUR_ENFANTS_CHARGE`, `SEJOUR_MOTIFS`, `SEJOUR_DUREES_SOUHAITEES`, `SEJOUR_CHANGEMENT_SITUATION`, `SEJOUR_DUREE_PRESENCE`, `SEJOUR_MOTIFS_REGULARISATION`, `SEJOUR_SUJETS_INFO`, `SSW` state, `swBuildPrompt`, `swGenerate`, panneau modif universel (`swModifyDoc`) — supporte `hybrid-select` et `tags` (avec variante `single: true` = radio-tags). Le noyau dynamique du wizard principal est maintenant branché sur `window.DokPeyiI18n` pour : noms de services, cartes de choix, titres dynamiques de l'étape 2, messages d'import, placeholders de sélection, cartes templates CV inline, panneau de modification (select, compteur, historique), états de chargement, récap paiement, erreurs paiement et écran de confirmation. `service.js` écoute `dokpeyi:langchange` pour rerendre les étapes 1 et 2 sans rechargement. Les refs i18n partagées `wiz_ref_*` couvrent désormais le poste mutualisé CV/lettre, les groupes entreprises/atouts de `lettre` et les groupes destinataires/types de `courrier`, avec labels/placeholders dynamiques dédiés. Reste à traduire les catalogues profonds et questions détaillées des services `dossier`, `sejour`, `impot` et `naturalisation`, ainsi que la parité fine des locales moins avancées du wizard principal. |
| `service.html` | Wizard client — structure HTML 3 étapes + prévisualisation iframe + panneau modif. Navbar premium alignée sur la landing (`.navbar`, `.nav-links`, CTA retour accueil, menu mobile). Le shell statique visible (nav, progression, chargement, paiement, cookies, notification SW) est branché sur `lang.js` via `data-i18n`. `service.css` est appelé avec suffixe de version (`?v=...`) pour casser les caches navigateurs lors des changements de header. `lang.css` et `lang.js` sont chargés pour permettre la traduction du shell et des premiers rerenders dynamiques de `service.js`. |
| `service.css` | Styles wizard + cartes templates + modif panel. Reprend aussi la grammaire du header premium de la landing pour les pages service. |
| `index.html` | Landing premium — hero, cartes services, témoignages, footer, bannière cookies et toast de mise à jour Service Worker. Tous les textes visibles de la page sont branchés sur `lang.js` via `data-i18n`, sauf le toast SW qui appelle `window.DokPeyiI18n.t()` au moment de l'affichage. `lang.js` est appelé avec suffixe de version (`?v=20260425-i18n-cachefix`) pour casser les caches navigateurs. |
| `a-propos.html` | Page institutionnelle — hero sombre, mission, 7 services + prix, ancrage Guyane (7 langues + organismes réels), engagements RGPD/qualité. Tous les textes visibles de la page sont branchés sur `lang.js`, hors email de contact et valeurs numériques. Nav/footer alignés sur index.html (liens `#services`, sans `#tarifs` ni `#demande`). CTAs → `/#services`. `lang.js` est appelé avec suffixe de version (`?v=20260425-i18n-cachefix`) pour casser les caches navigateurs. |
| `cv-catalogue.html` | Page standalone catalogue des 6 templates CV (lien `?template=XXX` vers wizard). Le shell visible est maintenant branché sur `lang.js` (`lang.css` + `lang.js?v=20260426-cvcat-i18n`) : nav publique dark premium, CTA retour wizard, header, note tarifaire. Les cartes templates rerendent aussi à chaud sur `dokpeyi:langchange` (noms, descriptions, badge premium/populaire, libellés `Inclus` / `Choisir ce modèle` / `Sélectionné`). Le bouton de choix de langue est injecté automatiquement dans la nav desktop/mobile. |
| `cv-wizard.html` | Tunnel CV Page 1 — galerie de 12 templates avec filtres par catégorie, miniatures inline HTML/CSS scalées (CV Yonel GOVINDIN, masculin, Assistant Administratif Polyvalent, 5 ans exp., 3 postes dont CNAF, 5 compétences, 4 langues dont Portugais), modale plein écran + module toggle photo BEM. Le shell visible est branché sur `lang.js` (`lang.css` + `lang.js?v=20260425-cvw-i18n`) : nav, hero, filtres, modale, étape 2, footer. Le bouton de choix de langue est injecté automatiquement dans la navbar desktop/mobile. CTA modale `#btn-choose` avec `data-i18n="cvw_choose_cta"` + `onclick` inline : lit `cv_template` + `cv_with_photo` depuis sessionStorage, redirige vers `/cv-wizard?step=2&template=NN`. Écran step=2 intégré (id `step2-screen`) avec : confirmation template (icône animée, nom, badge photo), séparateur doré, 3 cards mode (scratch/improve/target via `onclick` inline — `this.dataset.mode` → `sessionStorage.cv_mode`), `#btn-step2-continue` (désactivé par défaut, activé au choix de mode, redirige → `/cv-form`), `#btn-step2-back` (→ `/cv-wizard.html`). Chaque zone photo template porte la classe `cv-photo-zone`. Lien CSS versionné (`?v=20260426-step2`). Point d'entrée depuis `index.html` CTA CV. |
| `cv-form.html` | Tunnel CV Page 3 — formulaire multi-étapes 6 steps complets (identité, profil, expériences, formation, compétences/langues, complémentaires). Liens CSS/JS versionnés `?v=20260426-ux2` (css) / `?v=20260426-ux5` (js). Layout 2 colonnes `#form-panel` (45%) + `#preview-panel` sticky (55%). Step 5 : `.tags-input-wrap` compétences + `#suggestions-competences`. Step 6 : certifications (`data-field="certifications"` + `#suggestions-certifications`), intérêts (`data-field="interets"` + `#suggestions-interets`), complément (`data-field="complement"` + `#suggestions-infos_complementaires`) — chaque champ déclenche `triggerSuggestions` en oninput. Shell branché sur `lang.js?v=20260426-cvf-i18n2` + `cv-form.js?v=20260426-ux5`. Bouton langue auto dans nav desktop/mobile. |
| `cv-form.css` | Styles Page 3 — `.suggestions-wrap` en `flex-direction:column` (chips en lignes complètes, pas horizontaux). `.suggestion-chip` : `white-space:normal`, `word-break:break-word`, `border-radius:10px`, texte visible en entier. Navbar dark premium, layout grid 2 colonnes, progress bar or, champs, tags, recap. |
| `cv-form.js` | Logique Page 3 — `applySuggestion(field, value)` : accroche additif (`\n` sep), missions additif (`\n•`), competences push, interets/certifications additif (`, `), infos_complementaires additif (`\n`). `triggerSuggestions` : freeze (chips + loading) uniquement pour les champs non-missions — `missions_N` rechargent toujours quand l'intitulé de poste change ; changement de poste (isPosteField = accroche|competences|interets + poste !== lastPoste) vide ciblés `['accroche','competences','interets','certifications','infos_complementaires']` (ne vide PAS missions_N) ; chip cliquée supprimée via `this.remove()` ; `lastPoste` initialisé au DOMContentLoaded depuis `cvData.profil.poste`. Trigger missions : oninput vide `suggestions-missions_N` puis appelle `triggerSuggestions`. `triggerSuggestions` envoie `missions_N` au serveur (normalisé côté API). Preview accroche : HTML-escapée + `\n→<br>` (via `accrocheHtml` dans `renderTemplate`). Branché sur `DokPeyiI18n` + `dokpeyi:langchange`. |
| `cv-wizard.css` | Styles dédiés au tunnel CV — navbar dark premium, filtre catégorie, grille 3-col responsive, cards templates, badges prix/populaire, modale overlay, module `.photo-selector` BEM, écran step=2 (`.step2-inner`, `.step2-confirm` flex-column + gap 12px, `.step2-check-icon` animation `checkPop`, `.step2-divider` flex + `::before/::after`, `.step2-modes` grid 3-col, `.mode-card` + `.mode-card.active`, `.mode-card__icon/__title/__desc/__badge` BEM, `#btn-step2-continue` + `.enabled`, `#btn-step2-back`), animations. |
| `cv-wizard.js` | Logique tunnel CV — un seul `DOMContentLoaded` fusionné. Détection step=2 via `URLSearchParams` : masque `.gallery-hero, .filter-section, .tpl-section`, affiche `#step2-screen`, remplit `#step2-template-name` (format `NN — Nom`) et `#step2-photo-badge`. `tplId` résolu depuis `params.get('template')` ou `sessionStorage.cv_template`. `openModal()` persiste immédiatement `cv_template` et initialise `cv_with_photo` dans sessionStorage. Pas de listener JS sur `#btn-choose` — remplacé par `onclick` inline dans le HTML. Tunnel CV branché sur `window.DokPeyiI18n` via `CVW_TEMPLATES` (`cvw_tpl_01_*` → `cvw_tpl_12_*`) ; écoute `dokpeyi:langchange` pour rerendre noms, catégories et descriptions des 12 templates, la modale ouverte et l'écran step=2 sans rechargement. Toggle photo par `onclick` inline sur `.photo-card`. sessionStorage : `cv_template`, `cv_with_photo`, `cv_mode`. |
| `docs/superpowers/specs/2026-04-25-i18n-site-public-wizard-design.md` | Spec de design — chantier i18n centralisée du site public + wizard, hors admin et hors documents générés |
| `tests/service-nav.test.js` | Test de régression statique — vérifie que `service.html` expose les liens de navigation publics (`/#comment`, `/#services`, `/a-propos`, retour accueil) et réutilise la structure premium du header landing (`.navbar`, `.nav-links`, `.nav-cta`). |
| `tests/service-dynamic-i18n.test.js` | Test de régression i18n dynamique — vérifie que `service.js` est branché sur `DokPeyiI18n`, écoute `dokpeyi:langchange`, localise les labels/placeholders de questions via des clés dédiées (`wiz_q_*`) ou refs partagées (`wiz_ref_*`), et que `lang.js` expose les clés de feedback dynamiques du wizard principal (modification, chargement, paiement, confirmation, messages de review) ainsi que les catalogues profonds `lettre` / `courrier`. |
| `tests/cv-catalogue-i18n.test.js` | Test de régression i18n catalogue CV — vérifie que `cv-catalogue.html` charge `lang.css` + `lang.js`, expose les hooks de traduction de la nav publique, que les cartes templates sont branchées sur `DokPeyiI18n` / `dokpeyi:langchange`, et que `lang.js` expose les clés `cvcat_*` de la page catalogue. |
| `tests/cv-wizard-i18n.test.js` | Test de régression i18n tunnel CV — vérifie que `cv-wizard.html` charge `lang.css` + `lang.js`, expose les hooks de traduction de la nav publique, que `cv-wizard.js` est branché sur `DokPeyiI18n` / `dokpeyi:langchange`, et que `lang.js` expose les clés `cvw_*` du tunnel CV. |
| `tests/cv-form-i18n.test.js` | Test de régression i18n formulaire CV actif — vérifie que `cv-form.html` charge `lang.css` + `lang.js`, expose les hooks de traduction du shell visible, que `cv-form.js` est branché sur `DokPeyiI18n` / `dokpeyi:langchange`, et que `lang.js` expose les clés `cvf_*` dédiées à la page. |
| `tests/static-asset-cache.test.js` | Test de régression cache statique — vérifie que `404.html`, `index.html`, `a-propos.html`, `mentions-legales.html`, `cgv.html`, `confidentialite.html`, `cookies.html`, `legales.html`, `cv-catalogue.html` et `service.html` versionnent `lang.js`, que `service.html` versionne `service.css` et que `vercel.json` n'applique plus `immutable` aux CSS non hashés. |
| `tests/404-i18n.test.js` | Test de régression i18n page 404 — vérifie que `404.html` charge `lang.css` + `lang.js`, expose les hooks de traduction des textes visibles et conserve les liens vers les 5 services principaux. |
| `tests/mentions-legales-i18n.test.js` | Test de régression i18n mentions légales — vérifie que `mentions-legales.html` charge `lang.css` + `lang.js`, expose les hooks de traduction des textes visibles et que `lang.js` contient les clés `ml_*` dédiées. |
| `tests/cgv-i18n.test.js` | Test de régression i18n CGV — vérifie que `cgv.html` charge `lang.css` + `lang.js`, expose les hooks de traduction des textes visibles et que `lang.js` contient les clés `cgv_*` dédiées. |
| `tests/confidentialite-i18n.test.js` | Test de régression i18n confidentialité — vérifie que `confidentialite.html` charge `lang.css` + `lang.js`, expose les hooks de traduction des textes visibles et que `lang.js` contient les clés `conf_*` dédiées. |
| `tests/cookies-i18n.test.js` | Test de régression i18n cookies — vérifie que `cookies.html` charge `lang.css` + `lang.js`, expose les hooks de traduction des textes visibles et que `lang.js` contient les clés `cookies_*` dédiées. |
| `tests/legales-i18n.test.js` | Test de régression i18n hub légal legacy — vérifie que `legales.html` charge `lang.css` + `lang.js`, expose les hooks de traduction des textes visibles et que `lang.js` contient les clés `leg_*` dédiées. |
| `mentions-legales.html` | Mentions légales — page légale statique maintenant branchée sur `lang.js` (`lang.css` + `lang.js?v=20260425-mentions-i18n`) avec topbar légère compatible bouton langue, sections éditeur / publication / hébergeur / propriété intellectuelle / données personnelles / cookies / droit applicable / contact traduisibles, et footer branché sur les clés communes. |
| `cgv.html` | Conditions Générales de Vente — page légale statique maintenant branchée sur `lang.js` (`lang.css` + `lang.js?v=20260425-cgv-i18n`) avec topbar légère compatible bouton langue, tableau des tarifs, suppléments CV, options, remboursement, rétractation, disclaimer IA, responsabilité, données personnelles, juridiction et footer traduisibles. |
| `confidentialite.html` | Politique de confidentialité — page légale statique maintenant branchée sur `lang.js` (`lang.css` + `lang.js?v=20260426-conf-i18n`) avec topbar légère compatible bouton langue, tableau finalités/bases légales, sous-traitants, droits RGPD, sécurité, CNIL, contact et footer traduisibles. |
| `cookies.html` | Politique cookies — page légale statique maintenant branchée sur `lang.js` (`lang.css` + `lang.js?v=20260426-cookies-i18n`) avec topbar légère compatible bouton langue, synthèse cookies, tableau des cookies strictement nécessaires, section consentement, gestion navigateur, contact et footer traduisibles. |
| `404.html` | Page d'erreur 404 branded — `noindex`, topbar minimaliste avec bouton langue injecté via `.nav-links`, CTA retour accueil / `#services`, liens directs vers les 5 services principaux. Tous les textes visibles sont maintenant branchés sur `lang.js` (`lang.css` + `lang.js?v=20260426-404-i18n`). |
| `legales.html` | Hub légal de compatibilité — page legacy maintenant branchée sur `lang.js` (`lang.css` + `lang.js?v=20260426-legales-i18n`), avec topbar légère compatible bouton langue, sommaire, synthèse traduisible des mentions / CGU / CGV / confidentialité / cookies, et liens vers les pages légales détaillées. |
| `admin/index.html` | Dashboard admin |
| `admin/admin.js` | Logique dashboard admin |
| `admin/workspace-*.js` | Modules du workspace admin (chat, IA, projets, tâches, QC, agents…) |
| `lang.js` + `lang.css` | Système multilingue — 7 langues (fr/pt/ht/nl/ar/en/gcr). Base i18n centralisée pour le front public : fallback automatique vers `fr`, support DOM `data-i18n` / `data-i18n-html` / `data-i18n-ph` / `data-i18n-title` / `data-i18n-aria-label` / `data-i18n-value`, injection du bouton langue dans `.nav-links` et `.mobile-menu`. `lang.js` expose aussi `window.DokPeyiI18n` (`t`, `setLanguage`, `getDictionary`, `apply`, `onChange`, `offChange`) et émet l'événement `dokpeyi:langchange` pour les modules JS dynamiques (wizard, tunnel CV). `sw.js` applique désormais une stratégie network-first sur `/lang.js` et `/lang.css` pour éviter les traductions périmées après déploiement. |

Note : les templates CV sont définis dans `service.js` (constante `CV_TEMPLATES`, exposée via `window.CV_TEMPLATES`). Il n'existe pas de fichier `lib/cv-templates.js` séparé.

## Services disponibles
| ID | Service | Prix | Modèle IA | Review admin | Sous-types | État |
|---|---|---|---|---|---|---|
| `cv` | CV Professionnel | 8€ | claude-haiku-4-5 | Non | scratch / improve / pro | ✅ Fonctionnel |
| `lettre` | Lettre de motivation | 5€ | claude-haiku-4-5 | Non | create / improve / adapt | ✅ Fonctionnel |
| `courrier` | Courrier officiel | 7€ | claude-haiku-4-5 | Non | demande / reclamation / contestation | ✅ Fonctionnel |
| `dossier` | Dossier administratif | 12€ | claude-haiku-4-5 | Non | caf / logement / aide / autre | ✅ Fonctionnel |
| `sejour` | Titre de séjour | 15€ | claude-haiku-4-5 | **Oui** | premiere / renouvellement / regularisation / information | ✅ Fonctionnel |
| `impot` | Avis d'impôt | 10€ | claude-haiku-4-5 | Non | comprendre / aide / courrier | ✅ Fonctionnel |
| `naturalisation` | Naturalisation | 20€ | claude-haiku-4-5 | **Oui** | situation / dossier / lettre | ✅ Fonctionnel |

Les services avec review admin obligatoire (`sejour`, `naturalisation`) déclenchent la transition `generated → needs_review` au lieu de `generated → pending_payment`.

**Champs wizard dossier par sous-type** (définis dans `SVC.dossier.questions`, groupes dans `DOSSIER_*`) :
- `caf` : prestation (tags radio — RSA/APL/AAH/PAJE/ALS/ASF), situation_pro (tags radio), foyer (tags radio), revenus (select)
- `logement` : type_demande (tags radio — HLM/Mutation/Urgence/Hébergement urgence), departement (text), anciennete_liste (select), situation_actuelle (tags multi)
- `aide` : type_aide (tags multi — alimentaire/énergie/eau/mobilité/obsèques/rentrée scolaire), organisme_cible (tags radio — CCAS/MSA/CAF/Département 973/Croix-Rouge)
- `autre` : type (text libre), organisme (text libre)
- Tous les sous-types : description (textarea obligatoire), documents (textarea facultatif)
- Les champs spécifiques sont agrégés dans `{{dossier_contexte}}` (variable calculée dans `swBuildPrompt`) injectée dans le prompt dossier.

**Champs wizard séjour par sous-type** (définis dans `SVC.sejour.questions(choice)`, groupes dans `SEJOUR_*`) :
- Communs à tous : nationalite (hybrid-select — priorité Brésil/Haïti/Suriname/Guyana + Afrique subsaharienne), situation_familiale (tags radio), enfants_charge (tags radio)
- `premiere` : motif (tags radio — Travail/Regroupement familial/Études/Humanitaire/Retraité/Réfugié OFPRA), duree_souhaitee (tags radio)
- `renouvellement` : motif (tags radio identique), date_expiration (text), changement_situation (tags radio Oui/Non)
- `regularisation` : duree_presence (tags radio — Moins d'1 an/1–3 ans/3–5 ans/Plus de 5 ans), motif_regularisation (tags radio)
- `information` : sujet (tags radio — Droits/Procédure/Recours/Refus/Expulsion)
- Communs (suite) : situation (textarea obligatoire), documents (textarea), visa_actuel (select), situation_pro (select), historique_refus (radio)
- Les champs spécifiques sont agrégés dans `{{sejour_contexte}}` (variable calculée dans `swBuildPrompt`) injectée dans le prompt séjour.

## Templates CV
6 templates disponibles dans `CV_TEMPLATES` (service.js) et exposés sur la page `cv-catalogue.html`.
Le style de chaque template est injecté dans le prompt Emma via le placeholder `{{cv_template_style}}`.

| ID | Nom | Prix supplémentaire | Description |
|---|---|---|---|
| `classique` | Classique | +0€ (inclus) | Épuré et professionnel |
| `elite` | Élite | +4€ | Sidebar sombre, impact fort |
| `corporate` | Corporate | +2€ | Navy et sobre, idéal fonction publique |
| `impact` | Impact | +2€ | Dynamique, idéal commerce et BTP |
| `prestige` | Prestige | +4€ | Or et élégance, idéal santé et éducation |
| `executive` | Executive | +7€ | Ultra-minimaliste premium, direction et cadres |

### Tunnel CV — 12 templates (cv-wizard.html Page 1)
Nouvelle galerie 12 templates avec prévisualisation inline HTML/CSS scalée dynamiquement. `service.js` et `CV_TEMPLATES` restent inchangés (utilisés par le wizard existant).

| N° | Nom | Prix | Catégorie | Badge |
|---|---|---|---|---|
| 01 | Épuré | +0€ | Classique | Populaire |
| 02 | Sidebar Sombre | +2€ | Moderne | — |
| 03 | Brun Premium | +2€ | Moderne | — |
| 04 | Navy Corporate | +2€ | Classique | Populaire |
| 05 | Full Dark | +4€ | Premium | — |
| 06 | Dark Green | +4€ | Premium | — |
| 07 | Impact Rouge | +2€ | Moderne | — |
| 08 | Minimaliste Timeline | +0€ | Classique | — |
| 09 | Géométrique Or | +4€ | Premium | — |
| 10 | Wave Navy | +2€ | Moderne | Populaire |
| 11 | Yellow Dark | +2€ | Moderne | — |
| 12 | Cyber Neon | +7€ | Futuriste | — |

## Pipeline de génération
**État actuel (production)** : pipeline mono-agent.
`api/generate-cv.js` appelle une seule fois l'API Anthropic en streaming SSE, avec un `system` prompt global Dok'péyi (contexte Guyane) et le prompt métier construit côté client (`swBuildPrompt` dans `service.js`) ou côté serveur (`buildPrompt` dans `lib/content.js`).

- Modèle : `claude-haiku-4-5-20251001`
- `max_tokens` : 4096
- Rate-limit : 5 appels / minute / IP
- Limite prompt : 32 000 caractères
- Limite systemPrompt : 4 000 caractères
- Format réponse : `{ cv: "<!DOCTYPE html>…</html>" }`

Pour les services utilisant `lib/pipeline.js` (via `/api/pipeline` action `generate`) :
- appel Anthropic non-streaming
- format `json` → `lib/templates.js` rend le HTML final ; format `html` → passage brut
- actuellement en `json` : cv (scratch + pro) — tous les autres en `html`

**Pipeline 4 agents nommés (Emma → Viktor → Sofia → Léa)** : implémenté côté serveur dans `api/orchestrate.js`. Le client (`swGenerate` dans `service.js`) appelle `/api/orchestrate` en un seul fetch (timeout 120s). `swCallAgent` (panneau de modification) continue d'appeler `/api/generate-cv`. Emma utilise Opus (`claude-opus-4-6`) pour séjour/naturalisation, Sonnet (`claude-sonnet-4-20250514`) pour les autres services. Viktor utilise Haiku (`claude-haiku-4-5-20251001`). Sofia et Léa utilisent Sonnet (`claude-sonnet-4-20250514`).

## Branches Git
- **Branche principale** : `claude/create-website-AhMOy`
- **Convention commits** : `<type>(<scope>): <message>` — types `feat`, `fix`, `chore`, `refactor`, `test`, `merge`, scopes courants : `cv`, `lettre`, `courrier`, `dossier`, `sejour`, `impot`, `naturalisation`, `prompt`, `impot`
- **Tests obligatoires avant push** : `node --test tests/*.test.js` (229 / 229 OK)

## Déploiement Vercel
- **Production Branch** : `claude/create-website-AhMOy` (auto-deploy sur chaque push)
- **Edge Functions timeout** : 25 s (Hobby) / 60 s (Pro) — streaming maintient la connexion
- **CORS** : géré uniquement par `lib/edge-response.js` via `NEXT_PUBLIC_BASE_URL`
- **Headers sécurité** (`vercel.json`) : CSP, HSTS, X-Frame-Options, Referrer-Policy
- **Cache** : `no-store` sur `/api/*`, `must-revalidate` sur CSS non hashés, `immutable` sur `favicon.svg`, `no-cache` sur `sw.js`
- **Routing** : `cleanUrls: true` (pas de `trailingSlash` — évite la chaîne `/cv-wizard` → `/cv-wizard/` → 404)
- **Points d'attention** :
  - CORS unique — ne pas dupliquer les headers dans les handlers
  - Rate-limit en mémoire : reset à chaque cold start (acceptable en Edge)
  - Streaming Anthropic : obligatoire pour les documents lourds (évite idle timeout)
  - Aucune dépendance npm → pas de `node_modules` à builder

## Tests
- **Commande** : `npm test` (équivalent à `node --test tests/*.test.js`)
- **Résultat actuel** : 229 tests / 73 suites / 229 pass / 0 fail
- **Couverture** :
  - `api/admin-auth.js` — 11 tests
  - `api/ai-chat.js` — couvert
  - `api/create-checkout.js` — 7 tests
  - `api/generate-cv.js` — couvert
  - `api/payment-webhook.js` — 8 tests
  - `api/pipeline.js` — 7 tests
  - `api/redac-chat.js` — couvert
  - `api/send-email.js` — 6 tests
  - `api/suggest.js` — 14 tests de structure + logique mock
  - `lib/rate-limit.js` — 26 tests
  - `lib/documents.js` — 7 tests
  - `lib/review.js` — 5 tests
  - `service.html` — 2 tests de régression sur la navigation publique et la structure premium du header
  - `404.html` + `lang.js` — 3 tests de régression i18n sur la page 404
  - `mentions-legales.html` + `lang.js` — 2 tests de régression i18n sur les mentions légales
  - `cgv.html` + `lang.js` — 2 tests de régression i18n sur la page CGV
  - `confidentialite.html` + `lang.js` — 2 tests de régression i18n sur la politique de confidentialité
  - `cookies.html` + `lang.js` — 2 tests de régression i18n sur la politique cookies
  - `legales.html` + `lang.js` — 2 tests de régression i18n sur le hub légal de compatibilité
  - `cv-catalogue.html` + `lang.js` — 3 tests de régression i18n sur le catalogue des 6 templates CV
  - `cv-wizard.html` + `cv-wizard.js` + `lang.js` — 3 tests de régression i18n sur le tunnel CV
  - `cv-form.html` + `cv-form.js` + `lang.js` — 3 tests de régression i18n sur le formulaire CV actif
  - `service.css` — 2 tests d'intégrité (UTF-8 valide + absence d'octets NUL)
  - `404.html` + `index.html` + `a-propos.html` + `mentions-legales.html` + `cgv.html` + `confidentialite.html` + `cookies.html` + `legales.html` + `cv-catalogue.html` + `service.html` + `vercel.json` — 4 tests de régression sur le cache des assets statiques i18n/CSS
- **Non couvert** :
  - Wizard client (`service.js`) — pas encore de tests unitaires couvrant toute la logique interactive métier ; seule la couche i18n dynamique critique est verrouillée par régression statique
  - Flows E2E (navigation complète service → paiement → livraison)
  - Pages admin (`admin/*.js`)
  - `api/extract-doc.js`
  - Templates CV visuels (rendu `service.js` / `cv-wizard.html`)

## Conventions de code
- Pas de framework, vanilla JS/HTML/CSS uniquement
- ES modules côté serveur (`"type": "module"` dans `package.json`)
- CSS inline pour les documents générés (portabilité impression, emails)
- Nommage :
  - `sw*` : fonctions wizard client (`swInit`, `swGenerate`, `swBuildPrompt`…)
  - `SSW` : state object global du wizard (persisté sessionStorage)
  - `SVC` : config statique des services
  - `_priv` : helpers privés (underscore prefix)
- Prompts versionnés en dur dans le code (pas de base externe)
- Pas de commentaires JSDoc sur les fonctions triviales ; bloc d'en-tête en haut de chaque fichier Edge Function décrivant l'endpoint

## Roadmap
- **Phase 0 — Sécurité** : en attente Allan (Vercel env vars + Firebase rules + HSTS preload + rotation secrets)
- **Phase 1 — i18n expérience client** : design validé — cible = tout le site public + wizard, uniquement textes visibles à l'écran, hors admin et hors documents générés (spec : `docs/superpowers/specs/2026-04-25-i18n-site-public-wizard-design.md`)
- **Phase 1 — Prompts production** : ✅ terminé (prompts enrichis par service et sous-type, contexte Guyane, 7 services fonctionnels)
- **Phase 2 — Pipeline multi-agents** : ✅ implémenté (`api/orchestrate.js`) — Emma → Viktor → Sofia → Léa orchestré serveur. Mémoire partagée entre agents : à venir (Phase 2b)
- **Phase 3 — Premium et croissance** : en cours — Tunnel CV Page 1 (galerie 12 templates) ✅ livré. Tunnel CV Page 3 (formulaire 6 étapes) ✅ S3-B livré (structure + étapes 1-3), ✅ S3-C livré (étapes 4-6 : formation, compétences/langues tags, informations complémentaires + récap), ✅ i18n UI livrée pour le formulaire CV actif (`cv-form.html` + `cv-form.js`) avec sélecteur de langue dans la nav, shell statique traduit et rerender dynamique des cards / états IA / import PDF / récapitulatif. Le shell visible du tunnel CV Page 1 reste branché sur l'i18n centralisée (`lang.js`) avec sélecteur de langue dans la nav et rerender dynamique des cartes / modale / étape 2. Le catalogue 6 templates `cv-catalogue.html` est aussi branché sur l'i18n centralisée avec sélecteur de langue et rerender dynamique des cartes. Les pages `404.html`, `mentions-legales.html`, `cgv.html`, `confidentialite.html`, `cookies.html` et `legales.html` sont maintenant branchées sur l'i18n centralisée avec topbar légère et sélecteur de langue. Dans le wizard principal, le shell `service.html` est traduit et `service.js` couvre maintenant la couche dynamique commune (modification, chargement, paiement, confirmation), le flow CV de l'étape 2, ainsi qu'un premier lot de catalogues profonds `lettre` / `courrier` via refs i18n partagées (`wiz_ref_*`). Reste à étendre le même niveau de couverture aux services `dossier`, `sejour`, `impot` et `naturalisation`, puis à harmoniser complètement les locales secondaires du wizard principal. Prochain : S3-D (submitForm → génération IA + paiement).

## Équipe
- **Marvin** : produit, IA, prompts, wizard, SEO, contenu
- **Allan** : infrastructure, Vercel, Firebase, Stripe, PayPal, sécurité

# GET'COM — Site institutionnel

Site vitrine pour **GET'COM**, PME de signalisation routière, marquage au sol et travaux de génie civil (Île-de-France). Refonte complète d'un site mono-page existant vers une architecture multi-pages statique, en HTML/CSS/JavaScript vanilla (aucun framework, aucun back-end).

## Sommaire

- [Aperçu](#aperçu)
- [Stack technique](#stack-technique)
- [Structure du projet](#structure-du-projet)
- [Pages](#pages)
- [Fonctionnalités](#fonctionnalités)
  - [Navigation](#navigation)
  - [Formulaires (Formspree)](#formulaires-formspree)
  - [Chatbot](#chatbot)
  - [Carrousel clients](#carrousel-clients)
  - [Galerie filtrable](#galerie-filtrable)
  - [Animations au défilement](#animations-au-défilement)
- [Charte graphique](#charte-graphique)
- [Installation / démarrage local](#installation--démarrage-local)
- [Déploiement](#déploiement)
- [Limites connues](#limites-connues)

## Aperçu

| | |
|---|---|
| **Type** | Site vitrine statique, 6 pages |
| **Cible** | Direction, équipe commerciale, prospects et clients de GET'COM |
| **Back-end** | Aucun — formulaires gérés via [Formspree](https://formspree.io) |
| **Responsive** | Oui (mobile, tablette, desktop) |

## Stack technique

| Élément | Choix |
|---|---|
| Structure | HTML5 |
| Style | CSS3 (variables natives, sans préprocesseur) |
| Interactivité | JavaScript ES6+ (vanilla, sans dépendance) |
| Formulaires | [Formspree](https://formspree.io) (API de traitement de formulaires sans serveur) |
| Typographies | [Google Fonts](https://fonts.google.com) — Oswald (titres), Inter (texte) |
| Cartographie | Google Maps (iframe embed, page Contact) |
| Icônes | SVG inline (Feather Icons, style outline) |

## Structure du projet

```
.
├── index.html          # Page d'accueil
├── expertises.html      # Domaines d'expertise
├── capacites.html        # Parc matériel et capacités
├── projets.html           # Galerie de réalisations (filtrable)
├── recrutement.html        # Offres et candidature spontanée
├── contact.html             # Formulaire de devis + coordonnées
└── assets/
    ├── css/
    │   └── style.css     # Feuille de style unique, partagée par toutes les pages
    ├── js/
    │   └── script.js     # Script unique, partagé par toutes les pages
    ├── images/
    │   ├── index/
    │   ├── expertises/
    │   ├── capacites/
    │   ├── projets/
    │   ├── recrutement/
    │   └── contact/
    └── logos/            # Logos clients/partenaires (SVG)
```

> Toutes les pages partagent la même feuille de style (`assets/css/style.css`) et le même script (`assets/js/script.js`), suivant le principe DRY : la navigation, le pied de page, le chatbot et les popups sont identiques sur chaque page.

## Pages

| Fichier | Contenu principal |
|---|---|
| `index.html` | Hero avec slideshow d'images, stats clés, carrousel de logos clients, section certifications |
| `expertises.html` | Présentation des domaines d'expertise (signalisation horizontale, verticale, génie civil, aménagement intérieur) |
| `capacites.html` | Parc matériel et capacités opérationnelles (flotte, équipements) |
| `projets.html` | Galerie de réalisations, filtrable par catégorie |
| `recrutement.html` | Présentation des postes ouverts + formulaire de candidature |
| `contact.html` | Formulaire de devis, coordonnées, carte Google Maps |

## Fonctionnalités

### Navigation

- Barre de navigation fixe (`#navbar`), avec effet de fond au scroll.
- Menu mobile ("burger") avec bascule ARIA (`aria-expanded`) pour l'accessibilité.
- Lien d'appel direct (`tel:`) affiché dans la nav sur desktop.

### Formulaires (Formspree)

Trois formulaires distincts, chacun pointant vers un endpoint Formspree dédié :

| Formulaire | Page | Champs principaux |
|---|---|---|
| Devis | `contact.html` | Nom, e-mail, téléphone, message |
| Candidature | `recrutement.html` | Nom, prénom, e-mail, téléphone, poste souhaité (select), message |
| Rappel (popup chatbot) | Toutes les pages | Nom/entreprise, téléphone |

La soumission se fait en JavaScript via `fetch()` (pas de rechargement de page) : affichage d'un message de succès (`.form-success`) ou d'erreur (`.form-error`) selon la réponse de l'API.

### Chatbot

Assistant conversationnel basé sur la **reconnaissance de mots-clés** (pas de traitement du langage naturel), implémenté dans `script.js` :

- Une vingtaine de listes de mots-clés (`kwDevisContact`, `kwPmrNormes`, `kwHorairesDispo`, `kwSignalHorizontale`, `kwSignalVerticale`, `kwGenieCivil`, `kwRecrutement`, `kwEntreprise`, `kwSalutations`, etc.), une par intention utilisateur.
- `analyzeMessage(text)` compare le message saisi à chaque liste et retourne une réponse prédéfinie correspondante.
- Bouton flottant (`#chat-button`) pour ouvrir/fermer la fenêtre de discussion (`#chat-box`).
- Une popup dédiée permet de laisser un numéro de téléphone pour être rappelé, transmise également via Formspree.

### Carrousel clients

Défilement horizontal continu des logos partenaires (`#clientsTrack`), en CSS pur (`@keyframes logoScroll`), avec pause au survol (`:hover { animation-play-state: paused }`).

### Galerie filtrable

Sur `projets.html` : les cartes de projet portent un attribut `data-category`, et les boutons de filtre (`.filter-btn`) un attribut `data-filter`. Un écouteur de clic (`script.js`) compare les deux pour afficher/masquer les cartes correspondantes, sans rechargement de page.

### Animations au défilement

Utilisation de l'API native `IntersectionObserver` pour déclencher des animations d'apparition lorsqu'un élément entre dans le viewport, sans librairie externe et sans coût de performance au scroll.

## Charte graphique

| Élément | Valeur |
|---|---|
| Couleur primaire | Bleu marine `#0A0F1E` |
| Couleur d'accent | Doré `#E8A020` |
| Police des titres | Oswald |
| Police du texte courant | Inter |

Les variables sont centralisées en haut de `style.css` :

```css
:root {
  --gold:       #E8A020;
  --gold-light: #F0B030;
  --gold-dark:  #C88010;
  --navy:       #0A0F1E;
}
```

`style.css` est découpé en blocs commentés par page/section (`/* ── INDEX — hero ── */`, `/* ── PROJETS — projets.html ── */`, etc.) pour retrouver rapidement les styles propres à une page.

## Installation / démarrage local

Le site est 100 % statique : aucune installation ni build n'est nécessaire.

```bash
git clone <url-du-repo>
cd <dossier-du-projet>
```

Puis ouvrir `index.html` dans un navigateur, ou lancer un serveur local (recommandé pour éviter les soucis de chemins relatifs) :

```bash
# avec Python
python3 -m http.server 8000

# ou avec l'extension VS Code "Live Server"
```

Puis se rendre sur `http://localhost:8000`.

## Déploiement

Le site étant statique, il peut être hébergé sur n'importe quel hébergeur de fichiers statiques (GitHub Pages, Netlify, Vercel, OVH, etc.) sans configuration serveur particulière. Les seules dépendances externes sont Google Fonts, Formspree et Google Maps (embed), qui nécessitent une connexion internet côté client.

## Limites connues

- **Chatbot par mots-clés** : ne comprend pas le langage naturel ; une formulation inattendue peut ne pas être reconnue. Une évolution possible serait une intégration d'API de traitement du langage naturel.
- **Pas de back-end** : les formulaires dépendent entièrement de la disponibilité de Formspree.
- **Pas de CMS** : toute modification de contenu nécessite d'éditer le HTML directement.

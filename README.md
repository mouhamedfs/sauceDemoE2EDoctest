# 🎭 <span style="color:#7c3aed">SauceFlacky — Projet Playwright E2E (Doctest Test Architect (B3b))</span>

Suite de tests **Playwright + TypeScript** pour **SauceFlacky**, produite automatiquement à partir d'un crawl de votre application.
Suite E2E produite par **crawl Playwright + Test Architect** : parcours métier à risque, matrice risques/scénarios, score benchmark. Les tests superficiels (smoke page load, navigation générique) ne sont pas générés.

---

## 📋 <span style="color:#2563eb">Informations de génération</span>

| Champ | Valeur |
|---|---|
| Projet / client | **SauceFlacky** |
| URL demandée | `https://www.saucedemo.com/` |
| URL finale (après redirects) | `https://www.saucedemo.com/inventory.html#` |
| Pages crawlées | 4 |
| Titre de page | Swag Labs |
| Mode d'authentification crawl | Session authentifiée (storageState) |
| Niveau de génération | Test Architect (B3b) |
| `BASE_URL par défaut` | `https://www.saucedemo.com` |
| Navigateurs | **Chrome, Firefox, WebKit** — chaque scénario s'exécute sur les 3 |
| Specs générées | 4 fichiers · 12 scénarios (36 exécutions navigateur) |
| Généré le | 2026-05-24T23:10:24.508Z |

---

## 🚀 <span style="color:#16a34a">Démarrage rapide (5 minutes)</span>

### 📌 <span style="color:#64748b">Prérequis</span>

- **Node.js 20+**
- **npm** (ou pnpm/yarn — adaptez les commandes)

### 1. 🚀 Installer les dépendances

```bash
npm install
```

### 2. 🚀 Installer les navigateurs Playwright

```bash
npx playwright install chromium firefox webkit
```

### 3. 🚀 Lancer les tests

```bash
npm test
npm run test:smoke
```

> **`npm test`** — toute la suite sur Chrome, Firefox et WebKit + Allure (rapport ouvert automatiquement).
> **`npm run test:smoke`** — scénarios `@smoke` sur les 3 navigateurs + Allure.
> Chaque scénario est exécuté **3 fois** (projects `chromium`, `firefox`, `webkit`).
> En CI : `npm run test:ci`.

### 4. 🚀 Cibler un autre environnement

`playwright.config.ts` → `BASE_URL=https://www.saucedemo.com`

```bash
BASE_URL=https://staging.example.com npm test
```

### 5. 🚀 Consulter les rapports

- **Allure** (rapport principal) : ouvert automatiquement après `npm test`. Pour régénérer sans relancer les tests :

```bash
npm run allure:report && npm run allure:open
```

- **Couverture Doctest** : ouvrir `coverage-report.md` (inventaire crawl, matrice tests, limitations)

## 📁 <span style="color:#ca8a04">Versionner avec Git</span>

Un dépôt Git est **déjà initialisé** avec un commit initial (`chore: initial Playwright scaffold (Doctest B3a)`).

```bash
# Pousser vers votre remote (exemple)
git remote add origin git@github.com:mon-org/mon-projet-e2e.git
git branch -M main
git push -u origin main
```

> Si vous intégrez ces tests dans un monorepo existant, copiez les dossiers `tests/`, `pages/`, `fixtures/` et les configs plutôt que de pousser ce dépôt tel quel.


---

## 📁 <span style="color:#ca8a04">Structure du projet</span>

```
.
├── README.md                 # Ce guide
├── coverage-report.md        # Rapport de couverture détaillé
├── package.json
├── playwright.config.ts
├── tsconfig.json
├── .gitignore
├── global-setup.ts             # Login → playwright/.auth/user.json
├── .env                        # Credentials de test (gitignored, pré-rempli)
├── .env.example                # Modèle versionné
├── playwright/
│   └── .auth/
│       └── user.json         # Session Playwright (fournie à la génération — exclu du git)
├── .git/                     # Dépôt Git déjà initialisé
├── .github/workflows/e2e.yml
├── fixtures/
│   ├── test.fixture.ts       # Fixtures Playwright (POM injectés)
│   └── login.fixture.ts      # Fixture login (storageState vide)
├── pages/
│   ├── inventory.page.ts        # Page Object
│   ├── cart.page.ts             # Page Object
│   ├── checkout.page.ts         # Page Object
│   └── login.page.ts            # Page Object
└── tests/
    ├── login.spec.ts          # 3 tests
    ├── cart.spec.ts           # 3 tests
    ├── checkout.spec.ts       # 3 tests
    └── inventory.spec.ts      # 3 tests
```


## 🔐 <span style="color:#6366f1">Authentification — session globale + tests login</span>

Ce projet a été généré en **mode Session authentifiée** :

| Mécanisme | Fichier | Utilisé par | Rôle |
|---|---|---|---|
| **storageState** | `playwright/.auth/user.json` | Toutes les specs via `playwright.config.ts` | Simule un utilisateur **déjà connecté** pour tester l'app |
| **global-setup** | `global-setup.ts` | Avant l'exécution | Rafraîchit la session via `LoginPage.authenticate()` si credentials `.env` |
| **Fixture login** | `fixtures/login.fixture.ts` | `login.spec.ts` uniquement | `storageState` vide — teste la page de connexion comme un visiteur |

> `login.spec.ts` importe `../fixtures/login.fixture` — pas `test.fixture.ts`.

### 1. 🚀 Session Playwright (déjà incluse)

Le fichier `playwright/.auth/user.json` est **déjà présent** dans ce zip — c'est la session fournie lors de la génération Doctest. Les tests smoke / navigation / structure fonctionnent immédiatement.

> **Git** : `playwright/.auth/` est exclu du dépôt. En CI, définissez `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` pour que `global-setup.ts` recrée la session, ou injectez le fichier depuis un secret.

### 2. 🚀 Activer le cas passant login

Un fichier **`.env`** est déjà présent à la racine (chargé par `dotenv` dans `playwright.config.ts` et `global-setup.ts`).

```bash
# Éditer .env — compte de TEST dédié (jamais production)
TEST_USER_EMAIL=votre-compte-test@example.com
TEST_USER_PASSWORD=votre-mot-de-passe-test
```

Les tests **négatifs** login fonctionnent sans ces variables. Le test **connexion réussie** reste en `skip` tant que les deux champs sont vides.

En CI, définissez `TEST_USER_EMAIL` et `TEST_USER_PASSWORD` comme secrets du pipeline (en plus de `BASE_URL`).

### 🔑 <span style="color:#6366f1">Comment fonctionne global-setup.ts ?</span>

`global-setup.ts` s'exécute **une fois** avant tous les tests (`pnpm test`). Il décide de conserver la session du zip ou de se reconnecter et d'écraser `playwright/.auth/user.json`.

**Cas 1 — `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` vides (défaut après génération)**

1. `global-setup.ts` lit `.env` → pas de credentials
2. Si `playwright/.auth/user.json` existe (seed Doctest) → **ne fait rien**, log `Using pre-seeded auth state`
3. Les specs app (smoke, panier, checkout…) utilisent ce fichier via `playwright.config.ts`

Vous n'avez **pas besoin** de remplir `TEST_USER_*` pour lancer les tests app si la session du zip est encore valide.

**Cas 2 — credentials renseignés dans `.env`**

1. Lance un navigateur **vierge** (sans session)
2. `LoginPage.goto()` → `LoginPage.authenticate(email, password)`
3. Attend de quitter la page de login
4. Enregistre cookies + localStorage dans `playwright/.auth/user.json` (**écrase** l'ancien fichier)
5. Toutes les specs app héritent de cette session fraîche

Utile quand la session seed **a expiré**, en **CI** sans copier le JSON, ou pour rafraîchir les cookies avant un run.

**À quoi servent `TEST_USER_*`**

| Usage | Rôle de `TEST_USER_*` |
|---|---|
| Specs app (smoke, panier, checkout…) | Indirect — alimente `global-setup.ts` pour rafraîchir `user.json` |
| Cas passant `login.spec.ts` | Direct — le test remplit le formulaire avec ces valeurs |
| Tests login négatifs | **Non utilisé** — `login.fixture.ts` force un `storageState` vide |

```
pnpm test
    │
    ▼
global-setup.ts ──► TEST_USER_* renseignés ?
    │                      │
    │ non                  │ oui
    ▼                      ▼
user.json existe ?     LoginPage.authenticate()
    │                      │
    oui → garde le seed  écrit playwright/.auth/user.json
    non → erreur
    │
    ▼
playwright test ──► specs app = session user.json
                 ──► login.spec.ts = session vide (login.fixture)
```

### 📊 <span style="color:#2563eb">Matrice couverture login</span>

| Scénario | Statut à la génération | Action requise |
|---|---|---|
| Formulaire visible | ✅ Automatique | Aucune |
| Champs vides → erreur | ✅ Automatique | Aucune |
| Credentials invalides → erreur | ✅ Automatique | Aucune |
| Connexion réussie → redirection | ⏭ Skip si `.env` vide | Renseigner `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` |
| EP/BVA (email invalide, etc.) | 🔜 B3b Test Architect | Relancer en B3b |


### 📐 <span style="color:#9333ea">Conventions Doctest</span>

| Règle | Détail |
|---|---|
| **Page Objects** | Classes dans `pages/` — une page = une classe |
| **Fixtures** | POM via `test.extend()` in `fixtures/test.fixture.ts` |
| **Specs** | `tests/*.spec.ts` — **ne pas** instancier les POM avec `new XxxPage(page)` dans les specs |
| **Tags** | `@smoke` sur les tests de disponibilité critique |
| **Browsers** | Chrome, Firefox, WebKit (`playwright.config.ts` → 3 projects) |
| **Locators** | `#id` → `getByTestId()` → ARIA / label → `[name]` |

---

## 🧪 <span style="color:#0d9488">Fichiers de tests générés</span>

### `tests/login.spec.ts`

- **Couverture** : Rejet de connexion avec champs vides · Redirection vers login après expiration de session · Connexion avec identifiants invalides
- **Nombre de tests** : 3
- **Tags** : `@auth`, `@regression`, `@critical`

### `tests/cart.spec.ts`

- **Couverture** : Ajout d'un produit au panier depuis l'inventaire · Suppression d'un produit du panier · Retour aux achats depuis le panier
- **Nombre de tests** : 3
- **Tags** : `@smoke`, `@critical`, `@regression`

### `tests/checkout.spec.ts`

- **Couverture** : Finalisation de commande avec informations valides · Validation des champs obligatoires au checkout · Annulation du processus de checkout
- **Nombre de tests** : 3
- **Tags** : `@smoke`, `@critical`, `@regression`

### `tests/inventory.spec.ts`

- **Couverture** : Chargement et affichage des produits inventaire · Navigation entre inventaire et panier · Ouverture et fermeture du menu latéral
- **Nombre de tests** : 3
- **Tags** : `@smoke`, `@regression`



## 🏗️ <span style="color:#9333ea">Plan de test — Test Architect (B3b)</span>

Suite de tests Playwright complète pour l'application e-commerce Sauce Demo, couvrant les workflows critiques d'authentification négative, gestion du panier, processus de commande et validation des formulaires. La stratégie de test s'appuie sur les techniques EP, BVA, negative et state-transition pour valider les parcours utilisateur authentifiés avec une couverture robuste des cas d'erreur et des transitions d'état métier.

### 🧠 <span style="color:#0891b2">Techniques appliquées</span>

- EP
- BVA
- negative
- state-transition
- use-case

### 🛡️ <span style="color:#dc2626">Risques adressés</span>

- **[HIGH]** Échec d'authentification avec des identifiants invalides ou vides · Couverture: `partial` — mitigé par : login.spec.ts · gaps: CRUD-CREATE, FORM-FORM-1-HAPPY
- **[HIGH]** Perte de session utilisateur et accès non autorisé aux pages protégées · Couverture: `full` — mitigé par : login.spec.ts
- **[HIGH]** Dysfonctionnement du panier - ajout/suppression d'articles · Couverture: `full` — mitigé par : cart.spec.ts
- **[CRITICAL]** Échec du processus de commande avec données invalides ou manquantes · Couverture: `partial` — mitigé par : checkout.spec.ts · gaps: CRUD-CREATE, CRUD-CREATE-BVA, FORM-FORM-1-HAPPY
- **[MEDIUM]** Affichage incorrect des produits sur la page inventaire · Couverture: `full` — mitigé par : inventory.spec.ts

### 🎬 <span style="color:#16a34a">Scénarios conçus</span>

- `S1` **Rejet de connexion avec champs vides** → `login.spec.ts` (BVA) · tags: @auth, @regression
- `S2` **Redirection vers login après expiration de session** → `login.spec.ts` (state-transition) · tags: @auth, @critical
- `S3` **Ajout d'un produit au panier depuis l'inventaire** → `cart.spec.ts` (EP) · tags: @smoke, @critical
- `S4` **Suppression d'un produit du panier** → `cart.spec.ts` (state-transition) · tags: @smoke, @critical
- `S5` **Finalisation de commande avec informations valides** → `checkout.spec.ts` (use-case) · tags: @smoke, @critical
- `S6` **Validation des champs obligatoires au checkout** → `checkout.spec.ts` (BVA) · tags: @regression, @critical
- `S7` **Chargement et affichage des produits inventaire** → `inventory.spec.ts` (EP) · tags: @smoke
- `S8` **Navigation entre inventaire et panier** → `inventory.spec.ts` (state-transition) · tags: @smoke
- `S9` **Retour aux achats depuis le panier** → `cart.spec.ts` (state-transition) · tags: @regression
- `S10` **Annulation du processus de checkout** → `checkout.spec.ts` (negative) · tags: @regression
- `S11` **Ouverture et fermeture du menu latéral** → `inventory.spec.ts` (EP) · tags: @regression
- `S12` **Connexion avec identifiants invalides** → `login.spec.ts` (negative) · tags: @auth, @regression


**Verdict Test Architect** : Suite de tests complète couvrant les workflows critiques de l'application e-commerce Sauce Demo. 12 scénarios de test automatisés répartis sur 4 fichiers spec, couvrant l'authentification négative, la gestion du panier, le processus de commande et les interactions d'interface. Couverture robuste des risques métier identifiés avec techniques EP, BVA, negative et state-transition. Quelques gaps mineurs concernent des fonctionnalités génériques non spécifiques à cette application e-commerce.


---

## 📊 <span style="color:#2563eb">Ce que couvre cette génération</span>

### ✅ <span style="color:#16a34a">Inclus dans ce zip</span>

- Workflows d'authentification négative avec validation des erreurs
- Gestion complète du cycle de vie du panier (ajout, suppression, navigation)
- Processus de commande multi-étapes avec validation des formulaires
- Transitions d'état entre les pages principales de l'application
- Validation des champs obligatoires avec techniques BVA
- Navigation et interactions avec les éléments d'interface (menus, boutons)
- Workflows d'authentification négative avec validation des erreurs
- Gestion complète du cycle de vie du panier (ajout, suppression, navigation)
- Processus de commande multi-étapes avec validation des formulaires
- Transitions d'état entre les pages principales de l'application
- Validation des champs obligatoires avec techniques BVA
- Navigation et interactions avec les éléments d'interface (menus, boutons)

### 🔴 <span style="color:#dc2626">Gaps restants (post Test Architect)</span>

- **[MEDIUM]** `LIST-LOAD` — Chargement de la liste des ressources avec vérification des éléments affichés
  - Raison : Aucune fonctionnalité de liste de ressources spécifique détectée dans le crawl au-delà de l'inventaire des produits
  - Action suggérée : Identifier les listes de ressources spécifiques dans l'application et créer des tests dédiés

- **[MEDIUM]** `LIST-FILTER` — Filtrage ou recherche dans la liste des ressources
  - Raison : Aucun mécanisme de filtrage ou de recherche détecté dans les pages crawlées
  - Action suggérée : Vérifier si des fonctionnalités de filtrage existent et les tester si disponibles

- **[MEDIUM]** `CRUD-CREATE` — Création d'une nouvelle ressource avec données valides
  - Raison : Application e-commerce focalisée sur l'achat, pas de fonctionnalités CRUD détectées
  - Action suggérée : Confirmer si des fonctionnalités de création de ressources existent dans l'application
  - Risques liés : R1, R4

- **[MEDIUM]** `CRUD-CREATE-BVA` — Création d'une ressource avec champ obligatoire manquant
  - Raison : Pas de formulaires de création de ressources identifiés lors du crawl
  - Action suggérée : Identifier les formulaires de création si ils existent et appliquer les techniques BVA
  - Risques liés : R4

- **[LOW]** `FORM-FORM-1-HAPPY` — Soumission du formulaire form-1 avec données valides
  - Raison : Référence générique à un formulaire non spécifique - seul le formulaire de checkout est identifié
  - Action suggérée : Clarifier la référence au formulaire form-1 ou l'ignorer si non applicable
  - Risques liés : R1, R4

- **[LOW]** `FORM-FORM-1-BVA` — Soumission du formulaire form-1 avec champ obligatoire vide
  - Raison : Référence générique à un formulaire non identifié dans le crawl
  - Action suggérée : Clarifier la référence au formulaire form-1 ou l'ignorer si non applicable

Consultez `coverage-report.md` pour le détail complet (inventaire crawl, matrice tests, risques, limitations).


## ⚙️ <span style="color:#64748b">Intégration CI</span>

Un template **GitHub Actions (`.github/workflows/e2e.yml`)** est inclus avec **Doctest Flakiness Observability** pré-configuré.

1. Copiez le fichier CI dans votre repo applicatif (ou utilisez ce repo tel quel).
2. Définissez les secrets / variables : `BASE_URL`, `DOCTEST_PROJECT_TOKEN` (même valeur que dans `.env.example`).
3. Optionnel : `DOCTEST_API_URL` (défaut `https://api.doctest.dev`) — en local : `http://localhost:3001`.
4. La pipeline installe les dépendances, les navigateurs Playwright (Chrome, Firefox, WebKit), lance `npm run test:ci`, publie le rapport **Allure** en artifact, puis envoie les rapports JUnit + JSON via `npm run upload:doctest`.
5. Consultez le dashboard Doctest : `/app/flakiness/<DOCTEST_PROJECT_TOKEN>` pour suivre les tests instables.


---

## 🔧 <span style="color:#ea580c">Dépannage</span>

| Problème | Piste |
|---|---|
| `process`, `process.env` ou `node:path` rouges dans l'IDE | `npm install` (inclut `@types/node`) ; sinon `npm i --save-dev @types/node` puis redémarrer le serveur TypeScript |
| `Executable doesn't exist` | Relancer `npx playwright install chromium firefox webkit` |
| Allure ne s'ouvre pas | Vérifier `./allure-results/` puis `npm run allure:report && npm run allure:open` |
| Timeout / page blanche | Vérifier `BASE_URL` et l'accessibilité réseau de l'environnement |
| Tests auth échouent | Session expirée — regénérez le zip via Doctest avec un nouveau storageState, ou renseignez `TEST_USER_*` dans `.env` pour `global-setup.ts` |
| Test login passant en skip | Renseigner `TEST_USER_EMAIL` et `TEST_USER_PASSWORD` dans `.env` (chargé via dotenv) |
| Locators instables | Ajouter des `id` HTML stables ou des `data-testid` sur l'app |

---

## 💬 <span style="color:#6366f1">Support</span>

Projet généré par Doctest — Test Architect (B3b).

# 📈 <span style="color:#0891b2">Rapport de couverture E2E — SauceFlacky</span>

> Rapport lisible par un QA / QA Lead. Généré après crawl Playwright et Test Architect — **tous les fichiers spec** proviennent du LLM (parcours métier).

---

## 1. 📋 <span style="color:#2563eb">Contexte de génération</span>

| Champ | Valeur |
|---|---|
| Projet / client | **SauceFlacky** |
| URL demandée | `https://www.saucedemo.com/` |
| URL finale (après redirects) | `https://www.saucedemo.com/inventory.html#` |
| Pages crawlées | 4 |
| Titre de page | Swag Labs |
| Meta description | Sauce Labs Swag Labs app |
| Mode d'authentification crawl | Session authentifiée (storageState) |
| Niveau | Test Architect (B3b) |
| CI template | GitHub Actions (`.github/workflows/e2e.yml`) |
| Allure | **Oui** — rapport principal (`npm test` ouvre Allure) |
| Git initialisé dans le zip | Oui (commit initial inclus) |
| Généré le | 2026-05-24T23:10:24.509Z |

---

## 2. 📊 <span style="color:#0891b2">Synthèse exécutive</span>

| Indicateur | Valeur |
|---|---|
| Fichiers de spec | 4 |
| Scénarios générés | 12 |
| Exécutions navigateur | 36 (12 × 3) |
| Page Objects | 4 |
| Headings détectés | 0 |
| Liens internes détectés | 3 |
| Boutons détectés | 8 |
| Formulaires détectés | 1 |
| Attribut test-id (crawl) | `data-test` — `use.testIdAttribute` + `getByTestId()` |
| Champ mot de passe | **Oui** — login négatifs actifs ; passant en skip sans .env |


## 3bis. 🔑 <span style="color:#6366f1">Couverture login (mode authentifié)</span>

| Scénario | Spec | storageState utilisé ? | Statut |
|---|---|---|---|
| Structure du formulaire | `login.spec.ts` | **Non** (contexte vierge) | ✅ Actif |
| Champs vides | `login.spec.ts` | **Non** | ✅ Actif |
| Credentials invalides | `login.spec.ts` | **Non** | ✅ Actif |
| Connexion réussie | `login.spec.ts` | **Non** | ⏭ Skip si `.env` vide — `dotenv` charge `TEST_USER_*` |
| Smoke / navigation / structure app | autres specs | **Oui** (`playwright/.auth/user.json`) | ✅ Actif (fichier inclus dans le zip) |

> **Pourquoi le storageState ne suffit pas pour tester le login ?**  
> Le storageState représente une session déjà ouverte. Pour vérifier que la connexion *fonctionne*, il faut soumettre le formulaire avec de vrais credentials de test — fournis via `.env`, jamais stockés par Doctest.


**Verdict** : Suite de tests complète couvrant les workflows critiques de l'application e-commerce Sauce Demo. 12 scénarios de test automatisés répartis sur 4 fichiers spec, couvrant l'authentification négative, la gestion du panier, le processus de commande et les interactions d'interface. Couverture robuste des risques métier identifiés avec techniques EP, BVA, negative et state-transition. Quelques gaps mineurs concernent des fonctionnalités génériques non spécifiques à cette application e-commerce.


---

## 2b. Score de couverture benchmark (déterministe)

> Mesure **sans LLM** vs catalogue interne Doctest (`sauce-demo-v1`).  
> Première génération = parcours **critiques** ; objectif : **≥ 80 %**.  
> Un score partiel signifie que le fichier spec existe mais le scénario métier n’est pas encore détecté dans le code.

| Indicateur | Valeur |
|---|---|
| Benchmark | Swag Labs (saucedemo.com) — parcours critiques e-commerce |
| **Score** | **100 %** |
| Objectif | 80 % |
| Statut | **Objectif atteint** |
| Complets | 5 / 5 |
| Partiels | 0 |
| Manquants | 0 |

| ID | Parcours critique | Statut | Fichier spec |
|---|---|---|---|
| `SD-LOGIN-NEG` | Login — credentials invalides (classe négative / EP) | **OK** | `login.spec.ts` |
| `SD-CART-ADD` | Ajouter un produit au panier depuis l’inventaire | **OK** | `cart.spec.ts` |
| `SD-CART-REMOVE` | Retirer un produit du panier | **OK** | `cart.spec.ts` |
| `SD-CHECKOUT-BVA` | Checkout — champs obligatoires vides (BVA) | **OK** | `checkout.spec.ts` |
| `SD-CHECKOUT-HAPPY` | Checkout — parcours complet jusqu’à confirmation | **OK** | `checkout.spec.ts` |



---

## 3. 🔍 <span style="color:#0d9488">Inventaire crawl (éléments détectés — B3a)</span>

> **4 pages** visitées : `https://www.saucedemo.com/`, `https://www.saucedemo.com/inventory.html#`, `https://www.saucedemo.com/cart.html`, `https://www.saucedemo.com/checkout-step-one.html`
### 3.1 📑 <span style="color:#64748b">Titres (headings)</span>

_Aucun heading détecté._


### 3.2 🔗 <span style="color:#2563eb">Liens internes (même origine)</span>

| Libellé | URL |
|---|---|
| All Items | `https://www.saucedemo.com/inventory.html#` |
| All Items | `https://www.saucedemo.com/cart.html#` |
| All Items | `https://www.saucedemo.com/checkout-step-one.html#` |


### 3.3 🖱️ <span style="color:#0d9488">Boutons / actions</span>

- Open Menu
- Close Menu
- Add to cart
- Remove
- Continue Shopping
- Checkout
- Cancel
- Continue


### 3.4 📝 <span style="color:#9333ea">Formulaires</span>

**Formulaire 1**
  - firstName — type `text`, name=`firstName`
  - lastName — type `text`, name=`lastName`
  - postalCode — type `text`, name=`postalCode`
  - continue — type `submit`, name=`continue`

---

## 4. ✅ <span style="color:#16a34a">Matrice tests ↔ couverture</span>

| Fichier | Tests | Zone couverte | Tags |
|---|---:|---|---|
| `login.spec.ts` | 3 | Rejet de connexion avec champs vides · Redirection vers login après expiration de session · Connexion avec identifiants invalides | @auth, @regression, @critical |
| `cart.spec.ts` | 3 | Ajout d'un produit au panier depuis l'inventaire · Suppression d'un produit du panier · Retour aux achats depuis le panier | @smoke, @critical, @regression |
| `checkout.spec.ts` | 3 | Finalisation de commande avec informations valides · Validation des champs obligatoires au checkout · Annulation du processus de checkout | @smoke, @critical, @regression |
| `inventory.spec.ts` | 3 | Chargement et affichage des produits inventaire · Navigation entre inventaire et panier · Ouverture et fermeture du menu latéral | @smoke, @regression |


### 📋 <span style="color:#0891b2">Détail par zone couverte</span>

1. Workflows d'authentification négative avec validation des erreurs
2. Gestion complète du cycle de vie du panier (ajout, suppression, navigation)
3. Processus de commande multi-étapes avec validation des formulaires
4. Transitions d'état entre les pages principales de l'application
5. Validation des champs obligatoires avec techniques BVA
6. Navigation et interactions avec les éléments d'interface (menus, boutons)
7. Workflows d'authentification négative avec validation des erreurs
8. Gestion complète du cycle de vie du panier (ajout, suppression, navigation)
9. Processus de commande multi-étapes avec validation des formulaires
10. Transitions d'état entre les pages principales de l'application
11. Validation des champs obligatoires avec techniques BVA
12. Navigation et interactions avec les éléments d'interface (menus, boutons)


## 8. 🏗️ <span style="color:#9333ea">Test Architect (B3b)</span>

### 8.1 📝 <span style="color:#2563eb">Synthèse du plan</span>

Suite de tests Playwright complète pour l'application e-commerce Sauce Demo, couvrant les workflows critiques d'authentification négative, gestion du panier, processus de commande et validation des formulaires. La stratégie de test s'appuie sur les techniques EP, BVA, negative et state-transition pour valider les parcours utilisateur authentifiés avec une couverture robuste des cas d'erreur et des transitions d'état métier.

**Verdict** : Suite de tests complète couvrant les workflows critiques de l'application e-commerce Sauce Demo. 12 scénarios de test automatisés répartis sur 4 fichiers spec, couvrant l'authentification négative, la gestion du panier, le processus de commande et les interactions d'interface. Couverture robuste des risques métier identifiés avec techniques EP, BVA, negative et state-transition. Quelques gaps mineurs concernent des fonctionnalités génériques non spécifiques à cette application e-commerce.

### 8.2 🛡️ <span style="color:#dc2626">Matrice risques</span>

| ID | Risque | Sévérité | Couverture | Mitigation | Gaps résiduels |
|---|---|---|---|---|---|
| R1 | Échec d'authentification avec des identifiants invalides ou vides | high | partial | login.spec.ts | CRUD-CREATE, FORM-FORM-1-HAPPY |
| R2 | Perte de session utilisateur et accès non autorisé aux pages protégées | high | full | login.spec.ts | — |
| R3 | Dysfonctionnement du panier - ajout/suppression d'articles | high | full | cart.spec.ts | — |
| R4 | Échec du processus de commande avec données invalides ou manquantes | critical | partial | checkout.spec.ts | CRUD-CREATE, CRUD-CREATE-BVA, FORM-FORM-1-HAPPY |
| R5 | Affichage incorrect des produits sur la page inventaire | medium | full | inventory.spec.ts | — |


### 8.3 🎬 <span style="color:#16a34a">Scénarios et techniques</span>

Techniques : EP, BVA, negative, state-transition, use-case

| ID | Scénario | Technique | Spec | Tags |
|---|---|---|---|---|
| S1 | Rejet de connexion avec champs vides | BVA | `login.spec.ts` | @auth, @regression |
| S2 | Redirection vers login après expiration de session | state-transition | `login.spec.ts` | @auth, @critical |
| S3 | Ajout d'un produit au panier depuis l'inventaire | EP | `cart.spec.ts` | @smoke, @critical |
| S4 | Suppression d'un produit du panier | state-transition | `cart.spec.ts` | @smoke, @critical |
| S5 | Finalisation de commande avec informations valides | use-case | `checkout.spec.ts` | @smoke, @critical |
| S6 | Validation des champs obligatoires au checkout | BVA | `checkout.spec.ts` | @regression, @critical |
| S7 | Chargement et affichage des produits inventaire | EP | `inventory.spec.ts` | @smoke |
| S8 | Navigation entre inventaire et panier | state-transition | `inventory.spec.ts` | @smoke |
| S9 | Retour aux achats depuis le panier | state-transition | `cart.spec.ts` | @regression |
| S10 | Annulation du processus de checkout | negative | `checkout.spec.ts` | @regression |
| S11 | Ouverture et fermeture du menu latéral | EP | `inventory.spec.ts` | @regression |
| S12 | Connexion avec identifiants invalides | negative | `login.spec.ts` | @auth, @regression |



### 8.5 🔴 <span style="color:#dc2626">Matrice gaps ↔ risques</span>

| ID | Sévérité | Gap | Risques liés | Raison | Action suggérée |
|---|---|---|---|---|---|
| `LIST-LOAD` | medium | Chargement de la liste des ressources avec vérification des éléments affichés | — | Aucune fonctionnalité de liste de ressources spécifique détectée dans le crawl au-delà de l'inventaire des produits | Identifier les listes de ressources spécifiques dans l'application et créer des tests dédiés |
| `LIST-FILTER` | medium | Filtrage ou recherche dans la liste des ressources | — | Aucun mécanisme de filtrage ou de recherche détecté dans les pages crawlées | Vérifier si des fonctionnalités de filtrage existent et les tester si disponibles |
| `CRUD-CREATE` | medium | Création d'une nouvelle ressource avec données valides | R1, R4 | Application e-commerce focalisée sur l'achat, pas de fonctionnalités CRUD détectées | Confirmer si des fonctionnalités de création de ressources existent dans l'application |
| `CRUD-CREATE-BVA` | medium | Création d'une ressource avec champ obligatoire manquant | R4 | Pas de formulaires de création de ressources identifiés lors du crawl | Identifier les formulaires de création si ils existent et appliquer les techniques BVA |
| `FORM-FORM-1-HAPPY` | low | Soumission du formulaire form-1 avec données valides | R1, R4 | Référence générique à un formulaire non spécifique - seul le formulaire de checkout est identifié | Clarifier la référence au formulaire form-1 ou l'ignorer si non applicable |
| `FORM-FORM-1-BVA` | low | Soumission du formulaire form-1 avec champ obligatoire vide | — | Référence générique à un formulaire non identifié dans le crawl | Clarifier la référence au formulaire form-1 ou l'ignorer si non applicable |



---

## 5. ⚠️ <span style="color:#ca8a04">Limitations et risques connus</span>

- ⚠️ Mode authentifié : `playwright.config.ts` applique `playwright/.auth/user.json` ; login.spec.ts importe `fixtures/login.fixture.ts` (sans session).
- ⚠️ Cas passant login (connexion réussie) : renseigner TEST_USER_EMAIL et TEST_USER_PASSWORD dans le fichier `.env` (chargé via dotenv dans playwright.config.ts).
- ⚠️ Crawl multi-pages partiel (4 pages visitées) — pas un audit exhaustif du site.
- ⚠️ Tests limités aux pages crawlées - pas de couverture des pages de confirmation finale
- ⚠️ Validation des données de formulaire basée sur les champs détectés lors du crawl
- ⚠️ Pas de tests de performance ou de charge
- ⚠️ Couverture mobile et responsive non incluse dans cette suite
- ⚠️ Tests limités aux pages crawlées - pas de couverture des pages de confirmation finale
- ⚠️ Validation des données de formulaire basée sur les champs détectés lors du crawl
- ⚠️ Pas de tests de performance ou de charge
- ⚠️ Couverture mobile et responsive non incluse dans cette suite

---

## 6. ❌ <span style="color:#dc2626">Non couvert / gaps restants</span>

- ❌ [medium] LIST-LOAD — Chargement de la liste des ressources avec vérification des éléments affichés
- ❌ [medium] LIST-FILTER — Filtrage ou recherche dans la liste des ressources
- ❌ [medium] CRUD-CREATE — Création d'une nouvelle ressource avec données valides
- ❌ [medium] CRUD-CREATE-BVA — Création d'une ressource avec champ obligatoire manquant
- ❌ [low] FORM-FORM-1-HAPPY — Soumission du formulaire form-1 avec données valides
- ❌ [low] FORM-FORM-1-BVA — Soumission du formulaire form-1 avec champ obligatoire vide



---

## 7. 🎯 <span style="color:#7c3aed">Prochaines étapes recommandées</span>

1. **Exécuter localement** : `npm install && npx playwright install chromium firefox webkit && npm run test:smoke`
2. **Versionner** : pousser le dépôt Git déjà initialisé vers votre remote
3. **Stabiliser les locators** : ajouter des `data-testid` sur l'application cible si absents
4. **Brancher la CI** : configurer `BASE_URL` sur l'environnement de test
5. **Itérer** : compléter les gaps restants (section 6) ou activer Observe/Repair (B4+)
6. **Activer le login passant** : éditer `.env` avec un compte de test puis relancer `npm test`

---

_Généré par Doctest — Test Architect (B3b)._

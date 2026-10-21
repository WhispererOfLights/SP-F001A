# Audit du projet SP-F001A

Date de l'audit : 21 octobre 2026.

## Etat vérifié

- GitLab et GitHub pointent sur le même historique `main`.
- Le dépôt ne contient ni base SQLite, ni fichier `.env`, ni clé privée.
- Les chaînes détectées comme mots de passe dans l'historique sont les identifiants isolés des bases de test CI.
- La production répond avec PostgreSQL, schéma 3, en lecture/écriture.
- La suite locale complète passe : tests Python, métier JavaScript, interface navigateur, persistance SQLite et copie inter-OF.

## Nettoyage réalisé

- Suppression de `src/App.browser.jsx`, copie générée de la source qui n'était ni chargée ni testée directement.
- Le build ne conserve plus que `src/App.runtime.js`, qui est le livrable réellement servi au navigateur.
- Ajout d'un lanceur JavaScript portable et d'un `package.json` pour déclarer Playwright.
- Extension des CI GitLab et GitHub à toute la suite Python et JavaScript.
- Mise à jour de la documentation : PostgreSQL est désormais indiqué comme base de production.
- Nettoyage local des caches Python, captures et répertoires temporaires. Le dossier `data` est volontairement conservé.
- Ajout de contrôles serveur sur l'identité des OF, les visas d'annulation/restauration et les suppressions définitives.
- Remplacement des bundles React de développement par les bundles de production React 18.3.1.
- Ajout de `package-lock.json` pour figer les versions exactes des outils JavaScript.
- Découpage de `src/App.jsx`, ramené de 8 254 à 2 786 lignes : accueil, rapports et onglets métier sont isolés dans `src/modules/`.
- Les statuts OF/SN et le SN produit fini modifiés depuis l'accueil utilisent désormais une commande serveur atomique et ciblée.
- Les autorisations de cette commande sont couvertes par des tests serveur Manager/Admin et opérateur.
- Les saisies courantes enregistrent désormais uniquement l'onglet métier concerné ; le serveur refuse toute modification indirecte des autres onglets ou de l'en-tête.
- Une sauvegarde PostgreSQL récente a été recréée et son archive contrôlée : 20 ensembles de données sont lisibles par `pg_restore`.

## Travaux recommandés

### Priorité haute

1. Continuer à remplacer les quelques opérations multi-onglets par des commandes métier dédiées. Les saisies d'onglet, la clôture du suivi technique et les modifications rapides depuis l'accueil sont déjà ciblées.
2. Faire attribuer à un compte technique de restauration le droit de créer une base PostgreSQL temporaire, puis automatiser le test complet. Le compte de l'application ne possède volontairement pas ce droit.

### Priorité moyenne

1. Continuer à extraire les utilitaires partagés de `src/App.jsx` uniquement lorsque leur évolution le justifie ; les principaux domaines sont désormais séparés.

### Priorité basse

1. Créer des tags Git pour les versions déployées, à commencer par la prochaine version.
2. Retirer les outils de migration SQLite uniquement après validation de la durée de conservation du retour arrière.
3. Séparer, à terme, les fichiers nécessaires en production des tests et documents copiés par le script de déploiement.

## Limites de cet audit

La configuration Docker a été relue, mais aucune construction d'image n'a été exécutée car Docker n'est pas installé sur ce poste. Les pipelines distants valideront les environnements Linux après le prochain push.

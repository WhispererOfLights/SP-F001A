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

## Travaux recommandés

### Priorité haute

1. Renforcer les règles métier côté serveur. L'API de stockage autorise actuellement un rôle en écriture à remplacer un document OF complet. Les restrictions fines de l'interface, comme le God Mode, devraient aussi être contrôlées par le serveur.
2. Tester régulièrement une restauration complète des sauvegardes PostgreSQL, pas seulement leur création.

### Priorité moyenne

1. Découper progressivement `src/App.jsx`, qui dépasse 8 000 lignes, par domaine : accueil, Adjust/Rework, consommables, étuvages, suivi technique et rapports.
2. Remplacer les bibliothèques React de développement par leurs versions de production pour alléger le chargement navigateur.
3. Ajouter un verrou de dépendances Node dès que `npm` est installé sur le poste de développement ou généré par la CI.
4. Ajouter des tests serveur portant sur les autorisations de modification et de suppression à l'intérieur d'un OF.

### Priorité basse

1. Créer des tags Git pour les versions déployées, à commencer par la prochaine version.
2. Retirer les outils de migration SQLite uniquement après validation de la durée de conservation du retour arrière.
3. Séparer, à terme, les fichiers nécessaires en production des tests et documents copiés par le script de déploiement.

## Limites de cet audit

La configuration Docker a été relue, mais aucune construction d'image n'a été exécutée car Docker n'est pas installé sur ce poste. Les pipelines distants valideront les environnements Linux après le prochain push.

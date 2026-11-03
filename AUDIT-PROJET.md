# Audit du projet SP-F001A

Date de l'audit : 3 novembre 2026.

## Etat vérifié

- GitLab et GitHub pointent sur le même historique `main`.
- Le dépôt ne contient ni base SQLite, ni fichier `.env`, ni clé privée.
- Les chaînes détectées comme mots de passe dans l'historique sont les identifiants isolés des bases de test CI.
- La production répond avec PostgreSQL, schéma 4, en lecture/écriture.
- La suite locale complète couvre les tests Python, le métier JavaScript, l'interface navigateur, la persistance PostgreSQL et la copie inter-OF.

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
- Les opérations réellement multi-onglets utilisent une écriture atomique ciblée : copie d'un étuvage avec son four, scission de lot, changement de quantité et conversion SN/lot.
- Une sauvegarde PostgreSQL récente a été recréée et son archive contrôlée : 20 ensembles de données sont lisibles par `pg_restore`.
- Le paquet de production est limité aux fichiers d'exécution. Les tests, outils de migration, fichiers Docker et documents techniques restent dans Git et sont sauvegardés avant leur retrait d'une ancienne installation.
- Les visas opérationnels et leurs historiques sont désormais contrôlés côté serveur : un utilisateur ne peut pas attribuer une action à un autre visa, ni falsifier une correction Admin/Manager.
- Les historiques de modification et d'annulation sont en ajout seulement et leur auteur doit correspondre à la session connectée.
- Suppression de l'ancien composant Open Work devenu inutilisé ; la migration des anciennes données Open Work vers le suivi technique reste conservée.
- Suppression des composants d'historique visuel devenus inactifs et correction du retour de sauvegarde de secours afin que l'interface connaisse réellement le résultat de l'enregistrement.

## Travaux recommandés

### Priorité haute

1. Faire attribuer à un compte technique de restauration le droit de créer une base PostgreSQL temporaire, puis automatiser le test complet. Le compte de l'application ne possède volontairement pas ce droit. Ce point reste en attente des informations de l'IT.

### Priorité moyenne

1. Extraire la fenêtre de correction Admin/Manager de `src/App.jsx` lorsque ce domaine devra de nouveau évoluer ; les principaux domaines métier sont déjà séparés.

### Priorité basse

1. Retirer les outils de migration SQLite du dépôt uniquement après validation de la durée de conservation du retour arrière.

## Limites de cet audit

La configuration Docker a été relue, mais aucune construction d'image n'a été exécutée car Docker n'est pas installé sur ce poste. Les pipelines distants valideront les environnements Linux après le prochain push. Les outils de migration SQLite et le générateur PDF Python autonome sont encore conservés volontairement tant que leur retrait n'a pas été validé avec l'IT.

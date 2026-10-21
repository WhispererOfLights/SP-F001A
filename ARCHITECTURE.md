# Architecture SP-F001A

## Vue générale

- `server.py` sert l'interface, l'API d'authentification et l'API de stockage.
- `relational_store.py` transforme les documents applicatifs en tables SQLite relationnelles.
- `postgres_store.py` conserve les mêmes documents et révisions en JSONB dans PostgreSQL.
- `postgres_relational.py` maintient dans la même transaction les tables métier relationnelles destinées à l'exploitation et au reporting.
- `replication_bridge.py` réplique de façon rejouable les écritures SQLite vers PostgreSQL pendant la migration.
- `src/App.jsx` contient l'orchestration et les écrans métier.
- `src/modules/auth.jsx` contient connexion, profil et administration des utilisateurs.
- `src/clients.js` contient les clients navigateur d'authentification et de stockage.
- `scripts/build-app.cjs` assemble les sources et produit le runtime navigateur.

## Données

SQLite reste le backend par défaut et la source de vérité de la production actuelle. Lorsque `DATABASE_URL` est défini, PostgreSQL devient le backend principal. Les deux backends conservent les documents et leurs révisions sans modifier le contrat HTTP de l'interface.

Pendant la migration, l'outbox SQLite et le miroir PostgreSQL permettent de préparer et vérifier la nouvelle base sans interrompre le travail courant. La procédure complète est décrite dans `POSTGRESQL-MIGRATION.md`.

Chaque document possède une révision. Le navigateur envoie cette révision avec `If-Match`; le serveur refuse une écriture basée sur une ancienne version avec HTTP 409. L'interface conserve alors la modification en attente et propose soit de réessayer, soit de recharger le dossier.

PostgreSQL conserve le document JSONB comme représentation exhaustive et projette chaque écriture dans des tables relationnelles : `work_orders`, `of_units`, une table par onglet, les utilisateurs et les référentiels. Les deux représentations sont mises à jour dans une seule transaction. Le JSONB permet un retour arrière sans perte pendant la transition ; les tables relationnelles sont la surface recommandée pour les requêtes SQL.

Les référentiels sont séparés dans `status_types`, `consumable_catalog`, `technical_event_types` et `roles`. Les commentaires, périmètres SN/LOT et événements de connecteurs possèdent également leurs relations dédiées.

## Authentification

- Mots de passe: PBKDF2-HMAC-SHA256, sel aléatoire, 240 000 itérations.
- Migration: l'ancien hash est accepté une fois, puis remplacé après connexion réussie.
- Session: identifiant aléatoire dans un cookie `HttpOnly`, `SameSite=Strict`.
- Expiration: 15 minutes d'inactivité.
- Autorisation: contrôlée côté serveur pour les écritures, les listes de référence et la gestion des utilisateurs.

Les champs `pwd` et `passwordAuth` sont filtrés de toutes les réponses de l'API.

## Build et tests

`scripts/test-all.ps1` reconstruit d'abord le runtime, puis lance :

1. les tests unitaires et de migration SQLite;
2. les tests métier JavaScript;
3. les scénarios Playwright avec un vrai serveur HTTP et une vraie base temporaire.

Le déploiement ne doit se faire qu'avec `scripts/deploy.ps1`, qui bloque si un test échoue et crée une sauvegarde de la version précédente.

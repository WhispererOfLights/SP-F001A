# Architecture SP-F001A

## Vue générale

- `server.py` sert l'interface, l'API d'authentification et l'API de stockage.
- `relational_store.py` transforme les documents applicatifs en tables SQLite relationnelles.
- `src/App.jsx` contient l'orchestration et les écrans métier.
- `src/modules/auth.jsx` contient connexion, profil et administration des utilisateurs.
- `src/clients.js` contient les clients navigateur d'authentification et de stockage.
- `scripts/build-app.cjs` assemble les sources et produit le runtime navigateur.

## Données

SQLite est la source de vérité partagée. Les OF, unités SN/LOT et lignes métier sont stockés dans des tables relationnelles. Une enveloppe documentaire conserve les champs inconnus et la compatibilité avec les anciennes données.

Chaque document possède une révision. Le navigateur envoie cette révision avec `If-Match`; le serveur refuse une écriture basée sur une ancienne version avec HTTP 409. L'interface conserve alors la modification en attente et propose soit de réessayer, soit de recharger le dossier.

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

# Migration PostgreSQL sans perte de données

Cette procédure maintient SQLite comme source de vérité jusqu'à la bascule finale. Ne jamais supprimer ou déplacer la base SQLite d'origine pendant la migration.

## Prérequis fournis par l'IT

- une base PostgreSQL vide dédiée à SP-F001A ;
- une URL de connexion `postgresql://...` ;
- un hôte capable d'exécuter Docker ou le serveur Python ;
- une adresse HTTP stable ou un reverse proxy pour basculer vers le nouveau conteneur.

Les mots de passe et URL réelles restent dans les variables d'environnement, jamais dans Git.

## 1. Activer le journal sur la production SQLite

Configurer sur le serveur actuel :

```text
SP_F001A_REPLICATION_OUTBOX=1
```

Redémarrer le serveur. Les utilisateurs peuvent continuer à travailler. Chaque écriture est désormais enregistrée dans `replication_outbox`, dans la même transaction que la donnée métier.

Vérifier `/api/health` :

```json
{"backend":"sqlite","replicationMode":"sqlite-to-postgresql","replicationPending":0}
```

Le compteur augmente normalement tant que le miroir PostgreSQL n'est pas encore démarré.

## 2. Faire l'import initial en ligne

La commande utilise l'API de sauvegarde SQLite. Elle produit un instantané cohérent sans arrêter les opérateurs :

```powershell
$env:DATABASE_URL = "postgresql://<utilisateur>:<mot-de-passe>@<serveur>:5432/<base>"
python scripts\migrate_sqlite_to_postgres.py --sqlite "<chemin>\sp-f001a.sqlite" --replace
```

L'import conserve les documents, les types JSON et les révisions. Il relit ensuite PostgreSQL et compare l'empreinte SHA-256 de chaque document.

## 3. Démarrer le miroir

Ajouter sur le serveur SQLite actuel :

```text
SP_F001A_MIRROR_DATABASE_URL=postgresql://<utilisateur>:<mot-de-passe>@<serveur>:5432/<base>
```

Redémarrer le serveur. Les événements accumulés sont rejoués dans l'ordre. Une panne PostgreSQL n'empêche pas SQLite de fonctionner : les événements restent dans l'outbox.

Attendre que `replicationPending` revienne à `0`, puis laisser le miroir fonctionner pendant la recette du conteneur.

## 4. Tester le conteneur PostgreSQL

Copier `.env.example` en `.env`, renseigner les valeurs, puis sur une machine Docker :

```powershell
docker compose up --build -d
docker compose ps
```

Contrôler `/api/health`, les connexions, les PDF, les exports Excel et quelques dossiers représentatifs. Les vues `spf_work_orders`, `spf_units` et `spf_*` permettent à l'équipe Data de consulter les données métier.

## 5. Bascule finale

1. Créer le fichier configuré par `SP_F001A_READ_ONLY_FILE` sur l'ancien serveur.
2. Vérifier que `replicationPending` vaut `0`.
3. Exécuter la comparaison finale :

```powershell
python scripts\verify_sqlite_postgres.py --sqlite "<chemin>\sp-f001a.sqlite"
```

4. Si et seulement si le résultat annonce des documents strictement identiques, rediriger l'adresse HTTP stable vers le conteneur PostgreSQL.
5. Conserver l'ancien serveur SQLite en lecture seule pendant la période de validation.

## Retour arrière

Si un problème apparaît avant que des écritures soient autorisées sur PostgreSQL, rediriger simplement l'adresse vers l'ancien serveur et retirer son fichier de lecture seule.

Après l'ouverture des écritures PostgreSQL, ne pas revenir directement vers SQLite : effectuer d'abord une exportation PostgreSQL contrôlée. La base SQLite d'origine et les sauvegardes restent conservées jusqu'à validation formelle de la migration.

# Stockage SQL complet - schema version 3

## Activation

1. Terminer les sessions de travail et arreter le serveur de production (Ctrl+C).
2. Installer ensemble `server.py`, `relational_store.py`, `legacy_relational.py`,
   `index.html` et les fichiers `src/App.*`.
3. Relancer le serveur avec le meme dossier de donnees.
4. Actualiser tous les navigateurs avec Ctrl+F5.

Le premier demarrage sauvegarde la base via l'API SQLite dans
`data/sp-f001a-before-relational-<date-numerique>.sqlite`.
Cette sauvegarde conserve volontairement le format precedent pour le retour arriere.
La base active passe ensuite en version 3. La migration accepte aussi bien l'ancien
stockage cle/JSON (version 0/1) que le schema hybride (version 2).

La conversion est transactionnelle et verifie la restitution exacte de chaque
document ainsi que les cles etrangeres. Les revisions et dates existantes sont
conservees. En cas d'erreur, le serveur ne demarre pas, les anciennes tables sont
restaurees par rollback et la sauvegarde reste disponible.
Les anciens fichiers JSON ne sont pas reimportes apres activation, ce qui evite
de faire reapparaitre des lignes supprimees.

## Tables metier

- `work_orders` : OF, article, description, OTP/projet, reprise, statut.
- `users` : trigramme, prenom, nom, service, role, hash du mot de passe.
- `units` : SN, LOT, quantites, statut, SN produit fini, filiation.
- `rework_operations` : repere, action, article, valeur, quantite, LOT, DC,
  fiche suiveuse, OP, visas et dates de controle et de tracabilite.
- `consumable_operations`, `consumable_items` : contexte et consommables,
  echantillons, LOT, DP, visas et dates de tracabilite.
- `equipment_use`, `oven_runs` : equipements, fours et etuvages.
- `technical_facts`, `open_work` : faits techniques et Open Work.
- `connectors`, `connector_events` : connecteurs et Mating/Demating.
- `comments` : remarques et auteurs.
- `edit_history`, `history_changes` : modifications et changements avant/apres.
- `control_cancellations`, `trace_cancellations` : annulations des validations.
- `quantity_history`, `lot_splits`, `split_destinations` : quantites et scissions.
- `unit_scope_members` : SN inclus/exclus par une action.
- `reference_entries`, `of_index_entries` : listes de reference et index d'accueil.
- `unit_snapshots`, `edit_snapshots` : instantanes historiques en colonnes SQL.

Chaque champ simple est une colonne `field_<nom_du_champ_interface>` contenant une
valeur SQLite native (texte, entier, reel ou NULL), jamais un objet JSON serialise.
L'affinite SQLite sans conversion automatique preserve notamment les zeros des LOT,
les chaines vides et les types originaux. Les booleens de validation/annulation ont
des contraintes SQL 0/1. Un champ additionnel devient une colonne SQL supplementaire,
et non un complement JSON. Les objets additionnels vont dans `extension_records`
avec le meme stockage en colonnes ; leurs tableaux sont des lignes ordonnees.

## Relations et adaptation de l'interface

`documents` contient seulement la cle API, la categorie, la revision et la date.
`records` fournit les identifiants SQL et les relations parent/enfant avec cascade.
`collections` conserve l'existence des tableaux vides ; `field_types` conserve
l'existence et le type des champs (notamment absent versus NULL ou entier versus
texte). Ces tables techniques ne contiennent pas de contenu JSON.

`entity_links` relie les actions a leurs SN/LOT, les enfants a leur proprietaire,
et les lots aux sources/scissions. Des cles etrangeres et triggers empechent les
liens SN/LOT entre deux OF. Une reference historique vers une piece disparue reste
identifiable par son ancien ID, avec une cible SQL NULL : elle n'est pas recreee.
La suppression definitive nettoie les lignes et relations dependantes.

La table `storage` et les colonnes JSON `metadata`/`payload` du schema version 2
sont supprimees de la base active apres verification. `legacy_relational.py`
ne sert qu'a lire ce schema precedent pendant la migration.
Le JSON reste exclusivement le format d'echange HTTP et d'export/import.

L'API conserve les ecritures transactionnelles par dossier et refuse les revisions
perimees (HTTP 409). Les modifications concurrentes ne sont pas fusionnees : il faut
recharger et refaire la modification refusee. L'accueil lit les en-tetes reels des
dossiers sans reecrire l'index global a chaque modification d'une ligne.

## Exemple de requete SQL

```sql
SELECT w.field_of AS OF, r.field_repere AS Repere,
       r.field_action1 AS Action, r.field_valeur AS Valeur,
       r.field_dc AS DC, r.field_visaCtrl AS Controleur
FROM rework_operations AS r
JOIN work_orders AS w ON w.document_key = r.document_key
WHERE COALESCE(r.field_deleted, 0) = 0;
```

La vue SQL `operations` permet aussi de lister les operations de tous les onglets.

## Tests sans modification de la base source

```powershell
python tests/check_relational_migration.py "chemin/vers/sp-f001a.sqlite"
python tests/test_relational_store.py
node tests/storage-client.test.cjs
```

Le premier test utilise une sauvegarde SQLite temporaire, verifie tous les documents,
l'integrite SQL et l'absence de tables/colonnes de stockage JSON dans la copie.

## Retour arriere et securite

Arreter le serveur, sauvegarder la base actuelle, puis restaurer la sauvegarde
pre-migration et tous les fichiers applicatifs precedents ensemble. Les modifications
effectuees apres migration ne sont pas incluses dans la sauvegarde precedente.

Les bases, sauvegardes et fichiers serveur ne sont pas accessibles via les routes
de fichiers statiques. La migration ne fournit toutefois pas d'authentification
serveur pour l'API existante : les roles sont encore controles par l'interface.
Ne pas exposer l'API hors du reseau de confiance sans traiter cette securisation.

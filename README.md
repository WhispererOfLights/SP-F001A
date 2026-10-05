# SP-F001A - Suivi production

Interface Terrain de suivi de production par article, OF et numero de serie.

## Lancer en local simple

Depuis ce dossier :

```powershell
python -m http.server 5180 --bind 127.0.0.1
```

Puis ouvrir :

```text
http://127.0.0.1:5180/
```

Ce mode est pratique pour tester l'interface, mais les donnees restent dans le navigateur.

## Lancer en prod partagee

Copier tout le dossier du site dans le dossier reseau, par exemple :

```powershell
S:\OP\_SPACE\RAFS\_USO\SP-F001(Web)
```

Puis double-cliquer sur `start-prod.bat` depuis ce dossier. Par defaut la base partagee est stockee dans :

```text
S:\OP\_SPACE\RAFS\_USO\SP-F001(Web)\data\sp-f001a.sqlite
```

Il est aussi possible de choisir un autre dossier de donnees :

```bat
set "SP_F001A_DATA_DIR=S:\OP\_SPACE\RAFS\_USO\SP-F001(Web)\data"
```

Les postes production ouvrent ensuite le lien du PC qui fait tourner le serveur :

```text
http://NOM-DU-PC-SERVEUR:5181/
```

Le PC/serveur doit rester allume. Toutes les donnees persistantes sont ecrites dans la base SQLite `sp-f001a.sqlite`.
Si d'anciens fichiers JSON sont presents dans `data`, le serveur les importe automatiquement dans SQLite au demarrage sans les supprimer.

Important : en production il faut ouvrir l'application avec `http://NOM-DU-PC-SERVEUR:5181/`, pas en double-cliquant sur `index.html`. Le mode `file:///.../index.html` garde les donnees dans le navigateur local.

## Migrer les anciennes donnees navigateur vers la DB serveur

1. Lancer `start-prod.bat` sur le PC serveur.
2. Ouvrir `migration.html` depuis le meme navigateur qui contenait les anciennes donnees.
3. Mettre comme serveur destination :

```text
http://NOM-DU-PC-SERVEUR:5181/api/storage/
```

4. Cliquer sur `Telecharger sauvegarde JSON`, puis `Migrer vers le serveur`.

Apres migration, ouvrir uniquement :

```text
http://NOM-DU-PC-SERVEUR:5181/
```

## Première connexion

Sur une base neuve, le serveur crée le compte `ADMIN` avec un mot de passe temporaire et impose son changement à la première connexion.
Sur une base existante, les comptes et mots de passe actuels sont conservés. Lors de la première connexion après mise à jour, l'ancien mot de passe est converti automatiquement vers le nouveau stockage sécurisé.

Les sessions sont gérées par le serveur dans un cookie `HttpOnly` et expirent après 15 minutes d'inactivité. Les rôles sont également contrôlés côté serveur; masquer un bouton dans l'interface n'est plus la seule protection.

## Construire et tester

Depuis la racine du projet :

```powershell
node scripts\build-app.cjs
powershell -ExecutionPolicy Bypass -File scripts\test-all.ps1
```

`build-app.cjs` assemble les modules source et régénère `src/App.browser.jsx`, `src/App.runtime.jsx` et `src/App.runtime.js`.
`test-all.ps1` exécute les tests Python, les tests métier JavaScript et les scénarios navigateur/SQLite.

## Déployer

Le déploiement exécute d'abord tous les tests, incrémente la version du runtime et sauvegarde la version précédente :

```powershell
powershell -ExecutionPolicy Bypass -File scripts\deploy.ps1 -Version 212
```

Le dossier réseau par défaut est `\\neu-fs01.neu.orolia\Dpts\OP_SPACE\RAFS_USO\SP-F001(Web)`.
Voir aussi [ARCHITECTURE.md](ARCHITECTURE.md).

## Pack PDF

Dans un dossier OF ouvert, cliquer sur `Pack PDF`.
L'application cree directement un rapport PDF pack par OF avec une fiche par SN suivi, puis le telecharge dans le navigateur.

## Rapport PDF Python optionnel

Le bouton `JSON` telecharge les donnees du dossier courant.
Ce flux sert surtout de secours ou d'entree pour une future integration DevCenter.
Pour generer un rapport PDF depuis cet export :

```powershell
python scripts\generate_report.py C:\chemin\vers\SP-F001A_1212_rapport.json
```

Le PDF est cree par defaut dans :

```text
output/pdf/
```

Il est aussi possible de choisir le fichier de sortie :

```powershell
python scripts\generate_report.py C:\chemin\vers\rapport.json --output C:\chemin\vers\rapport.pdf
```

## Notes

- L'interface reste livrée comme des fichiers HTML/JS précompilés, servis par `server.py`.
- En mode `python -m http.server`, les donnees sont stockees dans le navigateur via `localStorage`.
- En mode `server.py`, les donnees persistantes passent par `/api/storage` et sont stockees dans une base SQLite unique : `data\sp-f001a.sqlite`.
- Les données métier et comptes sont stockés dans SQLite; les mots de passe ne sont jamais renvoyés au navigateur.

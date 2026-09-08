# SP-F001A - Suivi production

Interface Terrain de suivi de production par article, OF et numero de serie.

## Lancer en local

Depuis ce dossier :

```powershell
python -m http.server 5180 --bind 127.0.0.1
```

Puis ouvrir :

```text
http://127.0.0.1:5180/
```

## Connexion de test

- Utilisateur : `ADMIN`
- Mot de passe : `admin`

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

- Cette version est une application statique HTML/JS.
- Les donnees sont stockees dans le navigateur via `localStorage`.
- Pour une integration DevCenter multi-utilisateurs, prevoir un backend Python et une base partagee.

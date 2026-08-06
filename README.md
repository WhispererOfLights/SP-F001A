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

## Notes

- Cette version est une application statique HTML/JS.
- Les donnees sont stockees dans le navigateur via `localStorage`.
- Pour une integration DevCenter multi-utilisateurs, prevoir un backend Python et une base partagee.


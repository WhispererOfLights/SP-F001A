# Audit du projet SP-F001A

Date de l'audit : 16 novembre 2026.

## Verdict

SP-F001A est prêt pour la présentation aux responsables d'atelier mercredi.
Aucun défaut bloquant n'a été détecté sur l'application, PostgreSQL, les
sauvegardes ou le redémarrage automatique.

L'application reste un pilote hébergé sur un poste de travail. Sa mise en ligne
institutionnelle devra transférer l'hébergement et les sauvegardes vers une
infrastructure administrée par l'IT.

## Points d'attention

### Priorité moyenne

1. Le compte bootstrap `ADMIN` est encore actif et demande toujours un
   changement de mot de passe. Il doit être désactivé ou sécurisé avant
   d'élargir l'accès au-delà du groupe pilote.
2. Le serveur web et PostgreSQL dépendent encore de ce PC. Un arrêt matériel,
   une perte réseau ou une maintenance du poste rendent l'application
   indisponible. La tâche Windows couvre les redémarrages, mais pas l'arrêt du
   poste.
3. L'application est publiée en HTTP sur le réseau interne. Un hébergement IT
   devra ajouter HTTPS et un nom de service pérenne.
4. La sauvegarde PostgreSQL quotidienne utilise actuellement une tâche liée à
   la session utilisateur. Si aucune session n'est ouverte, la sauvegarde peut
   être reportée jusqu'à la prochaine connexion. Le serveur, lui, démarre bien
   sans ouverture de session.

### Priorité basse

1. La restauration d'une sauvegarde est maintenant validée manuellement, mais
   ce test n'est pas encore automatisé.
2. La configuration Docker est présente dans le dépôt, mais aucune image n'a
   été construite sur ce poste car Docker n'y est pas installé.
3. Les outils de migration SQLite sont conservés dans Git pour le retour
   arrière historique. Ils ne sont pas inclus dans le paquet de production.

## Contrôles réalisés

### Production

- Version servie : `v328`.
- URL réseau : `http://NEU-JGR-SP:5181/`.
- Backend : PostgreSQL 17.11, schéma applicatif 4.
- Mode lecture/écriture actif.
- Service PostgreSQL configuré en démarrage automatique.
- Le journal Windows prouve un lancement de `SP-F001A Serveur` le 14 novembre
  à 03:18, déclenché par le démarrage du système avant ouverture de session.
- Les fichiers de configuration contenant les secrets ne sont accessibles
  qu'à `SYSTEM` et `NEU\JGrosjean`.

### Base de données

- Taille : 18 MB.
- 132 documents, 83 OF, 177 SN/LOT et 44 utilisateurs actifs.
- 260 opérations Adjust/Rework, 231 consommables, 79 étuvages,
  182 enregistrements d'équipements et 37 événements techniques.
- Aucune clé étrangère invalide.
- Aucun doublon de numéro d'OF actif détecté.
- Aucun doublon de SN/LOT dans un même OF détecté.
- Dernière écriture observée le 16 novembre 2026 à 09:32.

### Sauvegardes

- Dernier dump PostgreSQL : 16 novembre 2026 à 06:50.
- Conservation quotidienne configurée sur 60 jours.
- Le dump a été restauré intégralement dans une base temporaire isolée.
- Après restauration : 132 documents, 83 OF, 44 utilisateurs, 177 SN/LOT et
  258 opérations Adjust/Rework, cohérents avec l'état au moment du dump.
- La base temporaire d'audit a ensuite été supprimée.
- Des sauvegardes de chaque version déployée sont également présentes sur le
  partage réseau.

### Code et tests

- Arbre Git local propre avant la mise à jour de ce rapport.
- GitLab et GitHub pointent sur le même commit `5698be5`.
- Le dernier workflow GitHub PostgreSQL est terminé avec succès.
- La suite de déploiement v328 est passée : 37 tests Python, tests métier
  JavaScript, interface Edge simulée, PDF, étiquettes, Excel SAP, invitations,
  persistance et droits utilisateurs.
- La migration de l'application monolithique continue : `App.jsx` mesure
  environ 3 200 lignes et les domaines principaux sont isolés dans
  `src/modules/`.
- Aucun fichier de base, dump, mot de passe, `.env` ou clé privée n'est suivi
  par Git.

## Checklist avant la démonstration

1. Ouvrir `http://NEU-JGR-SP:5181/` depuis le poste de présentation.
2. Vérifier `http://NEU-JGR-SP:5181/api/health` : `ok=true` et
   `backend=postgresql`.
3. Utiliser l'OF `Demo` pour éviter de modifier une OF de production.
4. Montrer le parcours accueil, SN/LOT, Adjust/Rework, consommables, étuvages,
   suivi technique, rapport PDF et export SAP.
5. Montrer la traçabilité : visas, corrections Admin/Manager, suppressions et
   commentaires.
6. Montrer la demande logistique et les invitations standardisées.
7. Garder le raccourci `server-status.vbs` disponible pour le contrôle manuel.

## Recommandations après la présentation

1. Faire désactiver ou sécuriser le compte bootstrap `ADMIN`.
2. Demander à l'IT un compte technique pour le serveur et les sauvegardes.
3. Déployer le conteneur sur une machine ou VM administrée, avec HTTPS.
4. Automatiser un test périodique de restauration PostgreSQL.
5. Continuer le découpage de `App.jsx` lorsque de nouveaux domaines évoluent.

## Limites de l'audit

Le statut du pipeline GitLab privé n'était pas lisible sans session GitLab.
Le push GitLab est confirmé, le dépôt GitHub est synchronisé et son workflow
PostgreSQL correspondant au commit courant est vert. L'image Docker n'a pas été
construite localement faute de moteur Docker.

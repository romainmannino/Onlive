# Onlive — App Store Connect (préparation soumission)

## Identité
- Nom : Onlive
- Bundle ID : com.romainmannino.onlive
- Version : 1.0.0
- Catégorie principale proposée : Réseaux sociaux
- Catégorie secondaire proposée : Divertissement
- Orientation : portrait
- iPad : non pris en charge actuellement (`supportsTablet: false`)

## Métadonnées proposées
### Sous-titre (30 caractères max)
La télé devient sociale

### Texte promotionnel proposé
Dis ce que tu regardes, vois ce que regardent tes proches et réagissez ensemble en direct.

### Description
Onlive transforme la télévision et les grands événements en expérience sociale entre proches.

Choisis ce que tu regardes, passe Onlive et vois quels proches sont connectés. Lorsqu’un proche regarde le même programme, vous pouvez discuter et réagir ensemble en direct.

Fonctionnalités :
- sélection d’un programme TV ou sportif ;
- statut Onlive / Offlive ;
- recherche de proches déjà inscrits à partir des contacts du téléphone ;
- discussions liées au programme regardé ;
- notifications de messages et d’invitations ;
- photo de profil ;
- invitations de proches.

Onlive n’est pas un service de streaming et ne diffuse aucun programme audiovisuel.

### Mots-clés proposés
onlive,tv,direct,sport,amis,discussion,live,programme,proches,social

## URLs finales
- Privacy Policy URL : https://onlive-app.com/privacy
- Support URL : https://onlive-app.com/support
- Marketing URL : https://onlive-app.com
- User Privacy Choices URL : https://onlive-app.com/delete-account

## App Privacy — état préparé
Les réponses App Privacy doivent représenter l’app finale et les SDK intégrés.

### Coordonnées
- Nom/pseudonyme : profil et affichage social — lié à l’identité.
- Adresse e-mail : création, authentification et récupération du compte — liée à l’identité.
- Numéro de téléphone : requis à la création du compte et utilisé pour la mise en relation avec les contacts — lié à l’identité.

### Contenu utilisateur
- Photo de profil : facultative — liée à l’identité.
- Messages : nécessaires aux discussions — liés à l’identité et au programme concerné.

### Contacts
- Avec autorisation, l’app lit les numéros du carnet d’adresses.
- Les numéros sont normalisés puis transmis au service pour rechercher les comptes Onlive correspondants.
- Les noms enregistrés dans le carnet du téléphone ne sont pas envoyés par ce mécanisme.

### Identifiants / fonctionnement
- Identifiant utilisateur Supabase.
- Tokens de notification push.
- Statut Onlive/Offlive.
- Programme sélectionné/regardé.
- Horodatages nécessaires à la présence et aux discussions.

### Publicité / tracking
V1 actuelle : aucune régie publicitaire tierce et aucun SDK publicitaire prévu. Ne pas déclarer de tracking publicitaire tant que cette situation reste vraie au moment du build soumis.

## Permissions iOS
- Contacts : retrouver les proches déjà inscrits.
- Photothèque : choisir une photo de profil.
- Caméra : prendre une photo de profil.
- Notifications : messages et activité utile au service.

## Suppression de compte
Parcours actuel : barre du bas → photo de profil → Compte → Supprimer mon compte → confirmation.

Ressource web externe : https://onlive-app.com/delete-account

Test final avec compte jetable :
1. compte Auth supprimé ;
2. profil/photo supprimés ;
3. tokens push supprimés ;
4. statut Onlive supprimé ;
5. données rattachées aux discussions/messages supprimées ou gérées conformément à la politique ;
6. reconnexion impossible après suppression.

## Compte reviewer Apple
Créer un compte de démonstration stable et sans donnée personnelle réelle.

Review Notes à fournir :
- identifiant du compte démo ;
- mot de passe ;
- préciser qu’Onlive ne diffuse aucun contenu TV ;
- expliquer : sélectionner un programme → passer Onlive → voir les proches → discussion uniquement si même programme ;
- préciser que Contacts/Photo/Caméra ne sont utilisées que pour les fonctions associées.

## Captures App Store finales
Apple accepte de 1 à 10 captures par taille d’écran. Pour iPhone, préparer la série principale au format 6,9 pouces accepté par App Store Connect. La narration prévue est de 6 visuels portrait.

1. **Accueil OFFLIVE** — « La télé devient sociale » — plusieurs programmes forts visibles dans le carrousel.
2. **Accueil ONLIVE** — programme sportif marquant — « Dis ce que tu regardes ».
3. **Tes proches Onlive** — plusieurs proches dont certains sur le même programme — « Vois qui regarde avec toi ».
4. **Discussions** — liste compacte du programme sélectionné — « Retrouve vos réactions en direct ».
5. **Chat** — sans image de programme — « Réagissez ensemble ».
6. **Contacts** — liste compacte — « Retrouve tes proches sur Onlive ».

Règles fixes :
- reproduire l’UI réelle actuelle ;
- vignettes programme sur une seule ligne horizontale ;
- OFFLIVE gris, ONLIVE dégradé Onlive ;
- navigation du bas à 4 entrées avec photo/initiales pour Compte ;
- aucun nom, numéro, photo ou message personnel réel ;
- pas d’image programme dans le chat ;
- textes courts, lisibles et non trompeurs ;
- les captures doivent représenter des fonctions réellement présentes dans l’app.

## Checklist avant “Submit for Review”
- [x] Domaine onlive-app.com accessible en HTTPS
- [x] Privacy Policy publique
- [x] Support URL publique
- [x] Delete Account URL publique
- [ ] Vérifier que support@onlive-app.com reçoit réellement les messages
- [ ] Vérifier que privacy@onlive-app.com reçoit réellement les messages
- [ ] Suppression de compte testée une dernière fois de bout en bout
- [ ] App Privacy complétée et publiée dans App Store Connect
- [ ] Compte reviewer créé et testé
- [ ] Captures finales générées et importées
- [ ] Icône finale validée
- [ ] Build production iOS généré
- [ ] Build installé/testé via TestFlight
- [ ] Notifications réelles testées app fermée
- [ ] Confirmation e-mail et mot de passe oublié testés sur build production
- [ ] Aucun écran/debug/test visible dans le build

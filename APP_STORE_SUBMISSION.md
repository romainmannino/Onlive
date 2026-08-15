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

### URLs
À activer avant soumission :
- Privacy Policy URL : https://onlive-app.com/privacy.html
- Support URL : https://onlive-app.com/support.html
- Marketing URL : https://onlive-app.com
- User Privacy Choices URL : https://onlive-app.com/delete-account.html

## App Privacy — brouillon de déclaration à confirmer avec le code final
Les réponses App Privacy doivent inclure les données collectées par l’app et par les SDK/prestataires intégrés.

### Coordonnées
- Adresse e-mail : collectée pour création/authentification/récupération de compte. Liée à l’identité.
- Numéro de téléphone : collecté si renseigné/utilisé pour la mise en relation avec les contacts. Lié à l’identité.
- Nom/pseudonyme : profil et affichage social. Lié à l’identité.

### Contenu utilisateur
- Photo de profil : choisie par l’utilisateur. Liée à l’identité.
- Messages : nécessaires aux discussions. Liés à l’identité et au programme concerné.

### Contacts
- Contacts du téléphone : utilisés pour retrouver des proches déjà inscrits et faciliter les invitations. À déclarer comme Contacts. Vérifier précisément si les numéros complets sont transmis/stockés ou uniquement normalisés/comparés.

### Identifiants
- Identifiant utilisateur Supabase : fonctionnement du compte.
- Token de notification push : acheminement des notifications.

### Données d’utilisation / autres
- Statut Onlive/Offlive.
- Programme regardé/sélectionné.
- Horodatages nécessaires au fonctionnement de la présence et des discussions.

### Données techniques
- Informations techniques strictement nécessaires au fonctionnement/sécurité via les SDK intégrés. Vérifier les déclarations des SDK Supabase, Expo, Firebase/APNs et Resend au moment de remplir App Store Connect.

### Publicité / tracking
Pour la V1 : aucune régie publicitaire tierce prévue et aucun tracking publicitaire à déclarer tant qu’aucun SDK ou ciblage publicitaire n’est intégré.

## Permissions iOS actuellement déclarées
- Contacts : retrouver les proches déjà inscrits.
- Photothèque : choisir une photo de profil.
- Caméra : prendre une photo de profil.
- Notifications : messagerie et activité utile au service.

## Suppression de compte
Parcours actuel dans l’app : photo de profil → Compte → Supprimer mon compte → double confirmation.

Avant soumission, vérifier sur un compte test que :
1. le compte Auth est supprimé ;
2. le profil et la photo sont supprimés ;
3. les tokens push sont supprimés ;
4. les statuts Onlive sont supprimés ;
5. les données de discussions/messages rattachées au compte sont supprimées ou anonymisées conformément à la politique annoncée ;
6. la reconnexion avec le compte supprimé est impossible.

## Compte de review Apple
Créer un compte de démonstration stable, sans donnée personnelle réelle.

Prévoir dans Review Notes :
- identifiant du compte démo ;
- mot de passe ;
- préciser qu’Onlive ne diffuse aucun contenu TV ;
- expliquer le parcours : choisir un programme → passer Onlive → voir un proche → discussion si même programme ;
- indiquer que les permissions Contacts/Photo/Caméra sont optionnelles selon les fonctions utilisées.

## Captures App Store
Prévoir 6 captures portrait, sans donnée personnelle réelle et en respectant exactement l’UI de l’app.

1. Accueil OFFLIVE — « La télé devient sociale » — programmes marquants sur une seule ligne.
2. Accueil ONLIVE sur un match type PSG–OM — « Dis ce que tu regardes ».
3. Proches Onlive sur le même programme — « Vois qui regarde avec toi ».
4. Chat sans image de programme — « Réagissez ensemble en direct ».
5. Notifications — nom du proche + programme + aperçu du message.
6. Contacts — « Retrouve tes proches sur Onlive ».

Règles visuelles fixes :
- vignettes programme uniquement sur une ligne horizontale ;
- OFFLIVE gris ;
- ONLIVE en dégradé Onlive ;
- pas d’image programme dans le chat ;
- navigation et composants identiques à l’app réelle ;
- noms/profils fictifs uniquement.

## Checklist avant “Submit for Review”
- [ ] Domaine onlive-app.com accessible en HTTPS
- [ ] Privacy Policy accessible dans l’app + sur le web
- [ ] Support URL accessible
- [ ] Suppression de compte testée de bout en bout
- [ ] App Privacy complétée et publiée
- [ ] Compte reviewer créé et testé
- [ ] Captures finales importées
- [ ] Icône finale validée
- [ ] Build production iOS généré
- [ ] Build installé/testé via TestFlight
- [ ] Notifications réelles testées app fermée
- [ ] Confirmation e-mail et mot de passe oublié testés sur build production
- [ ] Aucun écran/debug/test visible dans le build

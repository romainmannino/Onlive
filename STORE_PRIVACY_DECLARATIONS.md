# Onlive — Déclarations confidentialité Apple & Google

Ce document sert de guide de saisie pour App Store Connect et Google Play Console. Il doit être vérifié une dernière fois contre le build de production exact avant soumission.

## URLs publiques à utiliser
- Site / Marketing : https://onlive-app.com
- Politique de confidentialité : https://onlive-app.com/privacy
- Support : https://onlive-app.com/support
- Suppression de compte / Privacy choices : https://onlive-app.com/delete-account

## Fonctionnement vérifié dans le code actuel
- compte utilisateur via Supabase Auth ;
- e-mail de connexion et récupération ;
- numéro de téléphone potentiellement renseigné dans le profil ;
- nom / profil ;
- photo de profil ;
- accès Contacts pour retrouver des proches inscrits ;
- statut Onlive/Offlive et programme sélectionné ;
- discussions privées liées à un programme ;
- notifications push ;
- suppression de compte depuis l'application ;
- politique de confidentialité accessible depuis Compte.

# Apple — App Privacy

Apple demande de déclarer les données collectées par l'app et par les SDK tiers intégrés. Pour chaque type, App Store Connect demande notamment si la donnée est liée à l'identité et à quelles finalités elle sert.

## Types à déclarer pour Onlive — version de travail

### Contact Info
**Name**
- Collecté : Oui
- Lié à l'utilisateur : Oui
- Tracking : Non
- Finalités : App Functionality

**Email Address**
- Collecté : Oui
- Lié à l'utilisateur : Oui
- Tracking : Non
- Finalités : App Functionality, Account Management

**Phone Number**
- Collecté : Oui si renseigné / utilisé pour la mise en relation des proches
- Lié à l'utilisateur : Oui
- Tracking : Non
- Finalités : App Functionality, Account Management

### Contacts
**Contacts**
- Collecté / accédé : Oui, à confirmer selon la manière exacte dont les numéros du carnet sont transformés/transmis côté serveur
- Lié à l'utilisateur : à confirmer selon implémentation finale
- Tracking : Non
- Finalités : App Functionality

### User Content
**Photos or Videos**
- Photo de profil : Oui
- Lié à l'utilisateur : Oui
- Tracking : Non
- Finalités : App Functionality

**Emails or Text Messages / Other User Content**
- Messages de discussion Onlive : Oui
- Lié à l'utilisateur : Oui
- Tracking : Non
- Finalités : App Functionality

### Identifiers
**User ID**
- Collecté : Oui
- Lié à l'utilisateur : Oui
- Tracking : Non
- Finalités : App Functionality, Account Management

**Device ID / notification identifiers**
- Tokens push et identifiants techniques : Oui si Apple les classe dans Device ID selon l'implémentation du SDK
- Lié à l'utilisateur : Oui dans Onlive car token associé au compte
- Tracking : Non
- Finalités : App Functionality

### Usage Data / Other Data
**Product Interaction / Other Usage Data**
- Statut Onlive, programme sélectionné, activité fonctionnelle : à déclarer si utilisé comme donnée d'usage conservée côté serveur
- Lié à l'utilisateur : Oui
- Tracking : Non
- Finalités : App Functionality, Analytics uniquement si des analytics sont réellement activés dans le build

## Apple — réponses générales prévues
- Utilise les données pour suivre l'utilisateur entre apps/sites tiers : Non
- Publicité tierce : Non pour la V1
- Publicité ou marketing du développeur : Non pour la V1 sauf ajout ultérieur d'un moteur de campagne
- Analytics : Non sauf si un SDK/service d'analytics est réellement activé avant publication
- App Functionality : Oui pour la majorité des données ci-dessus
- Account Management : Oui pour les informations de compte

# Google Play — Data Safety

Google demande de déclarer les données collectées et partagées par l'app et ses SDK, ainsi que les finalités, le caractère obligatoire/facultatif et les pratiques de sécurité.

## Réponses générales prévues
- L'app collecte-t-elle des données utilisateur ? Oui
- L'app partage-t-elle des données avec des tiers ? En principe Non au sens « partage » marketing/publicitaire ; les prestataires techniques doivent être traités conformément aux définitions Google applicables aux service providers. Vérification finale obligatoire.
- Données chiffrées en transit : Oui, sous réserve du build final et des services utilisés
- L'utilisateur peut demander la suppression de ses données : Oui
- Création de compte : Oui
- Suppression dans l'app : Oui
- Suppression depuis le Web : Oui — https://onlive-app.com/delete-account

## Catégories Google prévues

### Personal info
- Name : collecté — App functionality / Account management
- Email address : collecté — App functionality / Account management
- Phone number : collecté si renseigné — App functionality / Account management
- User IDs : collecté — App functionality / Account management

### Contacts
- Contacts : accès au carnet d'adresses pour retrouver des proches — App functionality
- Déclaration exacte « collected » vs traitement éphémère à confirmer selon l'implémentation serveur finale

### Photos and videos
- Photos : photo de profil — App functionality

### Messages
- Other in-app messages : messages Onlive — App functionality

### App activity
- App interactions : statut Onlive, sélection de programme, activité liée aux discussions — App functionality
- Analytics uniquement si des analytics sont réellement ajoutés

### Device or other IDs
- Push notification token / identifiants techniques : App functionality

## Facultatif / obligatoire
- E-mail / identifiant de compte : requis pour utiliser le compte
- Nom / profil : selon onboarding final
- Téléphone : selon onboarding final ; confirmer s'il est obligatoire
- Contacts : facultatif car permission système révocable, mais certaines fonctions sociales seront limitées sans accès
- Photo : facultative
- Notifications : facultatives

# Suppression de compte

Parcours in-app actuel :
1. toucher la photo de profil ;
2. ouvrir Compte ;
3. toucher « Supprimer mon compte » ;
4. double confirmation ;
5. appel de la fonction serveur de suppression ;
6. déconnexion locale.

Parcours externe : https://onlive-app.com/delete-account

La page externe permet également une demande par e-mail depuis l'adresse liée au compte si l'utilisateur n'a plus accès à l'application.

# Vérifications obligatoires avant validation des formulaires

- Vérifier dans Supabase quelles données et tables sont réellement supprimées par la fonction `delete-account`.
- Vérifier si les messages sont supprimés, anonymisés ou soumis à cascade lors de la suppression du compte.
- Vérifier exactement ce qui est envoyé au serveur depuis le carnet d'adresses : numéros bruts, normalisés, hashés, ou autre.
- Vérifier si Expo/Firebase/Supabase génèrent des données de diagnostic ou analytics additionnelles dans le build production.
- Vérifier si Firebase Analytics est absent du build. Ne pas déclarer Analytics « Non » s'il est activé.
- Vérifier si le numéro de téléphone est obligatoire ou facultatif dans l'onboarding final.
- Ne pas ajouter de SDK publicitaire avant la première soumission sans refaire les deux déclarations.

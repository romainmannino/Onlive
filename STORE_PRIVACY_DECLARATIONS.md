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
- numéro de téléphone obligatoire lors de la création de compte actuelle ;
- nom / profil ;
- photo de profil ;
- accès Contacts facultatif pour retrouver des proches inscrits ;
- statut Onlive/Offlive et programme sélectionné ;
- discussions privées liées à un programme ;
- notifications push ;
- suppression de compte depuis l'application ;
- politique de confidentialité accessible depuis Compte ;
- aucune régie publicitaire intégrée dans la V1 actuelle.

## Contacts — fonctionnement vérifié
L'application demande l'autorisation Contacts puis lit localement les numéros de téléphone du carnet. Les numéros sont normalisés au format international lorsque possible (ex. +33...) puis transmis à la fonction Supabase `match_contact_phones`, par lots de 300 maximum, afin de déterminer quels numéros correspondent à des comptes Onlive.

Les noms des contacts du carnet restent utilisés localement dans l'application pour l'affichage : le mécanisme de rapprochement observé n'envoie pas les noms du carnet à Supabase. Les numéros transmis pour le rapprochement ne sont actuellement pas hashés côté application avant envoi.

# Apple — App Privacy

Apple demande de déclarer les données collectées par l'app et par les SDK tiers intégrés. Pour chaque type, App Store Connect demande notamment si la donnée est liée à l'identité et à quelles finalités elle sert.

## Types à déclarer pour Onlive — V1

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
- Collecté : Oui
- Lié à l'utilisateur : Oui
- Tracking : Non
- Finalités : App Functionality, Account Management
- Obligatoire actuellement à la création du compte : Oui

### Contacts
**Contacts**
- Accès : Oui
- Donnée transmise au serveur : numéros de téléphone normalisés du carnet, pour rapprochement avec les comptes Onlive
- Noms du carnet transmis au serveur par ce mécanisme : Non
- Lié à l'utilisateur : Oui / potentiellement associable à la session qui effectue la requête
- Tracking : Non
- Finalités : App Functionality

### User Content
**Photos or Videos**
- Photo de profil : Oui
- Lié à l'utilisateur : Oui
- Tracking : Non
- Finalités : App Functionality

**Other User Content / In-app messages**
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
- Tokens push / identifiants techniques : Oui
- Lié à l'utilisateur : Oui, car le token push est associé au compte Onlive
- Tracking : Non
- Finalités : App Functionality

### Usage Data / Other Data
**Product Interaction / Other Usage Data**
- Statut Onlive/Offlive : Oui
- Programme sélectionné : Oui
- Activité nécessaire aux discussions / notifications : Oui
- Lié à l'utilisateur : Oui
- Tracking : Non
- Finalités : App Functionality
- Analytics : Non dans la V1 tant qu'aucun service analytics additionnel n'est activé

## Apple — réponses générales prévues
- Utilise les données pour suivre l'utilisateur entre apps/sites tiers : Non
- Publicité tierce : Non pour la V1
- Publicité ou marketing du développeur : Non pour la V1
- Analytics : Non pour la V1 actuelle, à revérifier sur le build de production
- App Functionality : Oui pour la majorité des données ci-dessus
- Account Management : Oui pour les informations de compte

# Google Play — Data Safety

## Réponses générales prévues
- L'app collecte-t-elle des données utilisateur ? Oui
- L'app partage-t-elle des données avec des tiers à des fins publicitaires/marketing ? Non
- Prestataires techniques : Supabase, Expo, Firebase Cloud Messaging / APNs et Resend interviennent comme prestataires nécessaires au service ; vérifier la qualification exacte demandée par le formulaire Google lors de la saisie
- Données chiffrées en transit : Oui via HTTPS/TLS pour les services utilisés
- L'utilisateur peut demander la suppression de ses données : Oui
- Création de compte : Oui
- Suppression dans l'app : Oui
- Suppression depuis le Web : Oui — https://onlive-app.com/delete-account

## Catégories Google prévues

### Personal info
- Name : collecté — App functionality / Account management
- Email address : collecté — App functionality / Account management
- Phone number : collecté et actuellement obligatoire à l'inscription — App functionality / Account management
- User IDs : collecté — App functionality / Account management

### Contacts
- Contacts : Oui
- Données réellement transmises au serveur pour le rapprochement : numéros de téléphone normalisés
- Noms du carnet : non transmis par le mécanisme de matching observé
- Finalité : App functionality
- Permission : facultative / révocable au niveau du système

### Photos and videos
- Photos : photo de profil — App functionality — facultatif

### Messages
- Other in-app messages : messages Onlive — App functionality

### App activity
- App interactions : statut Onlive, sélection de programme, activité liée aux discussions — App functionality
- Analytics : Non dans la V1 actuelle tant qu'aucun SDK analytics n'est ajouté

### Device or other IDs
- Push notification token / identifiants techniques : App functionality

## Facultatif / obligatoire
- E-mail : obligatoire
- Mot de passe : obligatoire
- Téléphone : obligatoire dans l'onboarding actuel
- Nom / profil : créé à partir de l'identité du compte puis modifiable selon l'évolution produit
- Contacts : facultatif car permission système révocable ; les fonctions de découverte des proches sont limitées sans accès
- Photo : facultative
- Notifications : facultatives

# Suppression de compte — vérifiée côté Supabase

Parcours in-app actuel :
1. toucher la photo de profil ;
2. ouvrir Compte ;
3. toucher « Supprimer mon compte » ;
4. double confirmation ;
5. appel de la fonction serveur `delete-account` ;
6. suppression du compte et déconnexion.

La fonction Edge `delete-account` vérifiée sur le projet Supabase supprime notamment :
- les messages envoyés par l'utilisateur ;
- l'appartenance de l'utilisateur aux salons ;
- les alias / rapprochements de contacts associés ;
- les notifications de programme envoyées ou reçues ;
- les tokens push ;
- les préférences de notification ;
- le statut Onlive ;
- les photos de profil dans le dossier Storage `avatars/<user-id>/` ;
- la ligne `profiles` ;
- le compte Supabase Auth.

Pour les salons créés par l'utilisateur : s'il reste un autre membre, la propriété du salon est réattribuée à un autre membre ; s'il ne reste personne, le salon, ses membres et son contenu sont supprimés.

Parcours externe : https://onlive-app.com/delete-account

La page externe permet également une demande par e-mail depuis l'adresse liée au compte si l'utilisateur n'a plus accès à l'application.

# Vérifications finales avant validation des formulaires

- Tester une dernière suppression avec un compte jetable et vérifier la disparition effective du compte Auth + profil + avatar.
- Vérifier sur le build de production qu'aucun SDK Analytics ou publicitaire supplémentaire n'a été ajouté.
- Vérifier que les URLs publiques `privacy`, `support` et `delete-account` répondent en HTTPS après propagation DNS/Vercel.
- Vérifier que `support@onlive-app.com` et `privacy@onlive-app.com` reçoivent réellement les messages.
- Ne pas ajouter de SDK publicitaire avant la première soumission sans refaire les déclarations Apple et Google.

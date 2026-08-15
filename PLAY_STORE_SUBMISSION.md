# Onlive — Google Play Console (préparation soumission)

## Identité
- Nom : Onlive
- Package : com.romainmannino.onlive
- Version : 1.0.0
- Catégorie proposée : Social / Divertissement

## Fiche Store proposée
### Description courte
Dis à tes proches ce que tu regardes et discute avec ceux qui suivent le même programme.

### Description complète
Onlive transforme la télévision et les grands événements en expérience sociale entre proches.

Choisis ce que tu regardes, passe Onlive et vois quels proches sont connectés. Lorsqu’un proche regarde le même programme, vous pouvez discuter et réagir ensemble en direct.

Fonctionnalités :
- sélection d’un programme TV ou sportif ;
- statut Onlive / Offlive ;
- recherche de proches déjà inscrits à partir des contacts ;
- discussions liées au programme regardé ;
- notifications de messages et d’invitations ;
- photo de profil ;
- invitations de proches.

Onlive ne diffuse aucun contenu TV ou sportif : l’application crée un espace social autour de ce que vous regardez déjà.

## URLs finales
- Privacy Policy : https://onlive-app.com/privacy
- Suppression de compte externe : https://onlive-app.com/delete-account
- Support / site : https://onlive-app.com/support

## Data Safety — état préparé
### Données traitées par l’app
- Nom/pseudonyme
- Adresse e-mail
- Numéro de téléphone requis à la création du compte
- Photo de profil facultative
- Identifiant utilisateur
- Token push
- Statut Onlive/Offlive
- Programme sélectionné/regardé
- Messages de discussion
- Horodatages nécessaires au fonctionnement
- Numéros issus des contacts du téléphone utilisés pour retrouver les proches déjà inscrits

### Contacts du téléphone
Avec autorisation, l’app lit les numéros du carnet d’adresses. Ils sont normalisés puis transmis au service afin de rechercher les comptes Onlive correspondants. Les noms enregistrés localement dans le carnet ne sont pas envoyés par ce mécanisme.

### Finalités principales
- Fonctionnement de l’application
- Gestion et sécurité du compte
- Fonctionnalités sociales
- Messagerie
- Notifications
- Support et sécurité

### Publicité
V1 actuelle : aucune régie publicitaire tierce et aucun SDK publicitaire intégré. Déclaration Ads prévue : Non, tant que le build soumis reste identique sur ce point.

### Prestataires techniques
Supabase, Expo, Firebase Cloud Messaging, Apple Push Notification Service et Resend sont utilisés selon les plateformes/fonctions. La déclaration Data Safety doit rester cohérente avec le build final et les flux de ces prestataires.

## Suppression de compte Google Play
Onlive permet la création de compte. Le parcours est disponible :
1. dans l’app : barre du bas → photo de profil → Compte → Supprimer mon compte ;
2. sur le web : https://onlive-app.com/delete-account

La page web permet également d’initier la demande par e-mail si l’utilisateur n’a plus accès à l’application.

## App Access / reviewer
Créer un compte démo stable et transmettre les identifiants dans App access si l’accès complet nécessite une connexion.

Instructions reviewer :
- se connecter ;
- sélectionner un programme ;
- passer Onlive ;
- consulter les proches Onlive ;
- discuter uniquement lorsqu’un proche est sur le même programme.

## Permissions Android
- READ_CONTACTS
- POST_NOTIFICATIONS
- CAMERA
- accès photo selon le mécanisme fourni par expo-image-picker et la version Android

Avant production, contrôler le manifeste du bundle final et vérifier que chaque permission réellement présente est nécessaire et déclarée de façon cohérente dans Play Console.

## Captures Google Play finales
Google Play exige au minimum deux captures pour publier la fiche ; pour une présentation de qualité et l’éligibilité à davantage de surfaces de recommandation, préparer au moins quatre visuels de 1080 px minimum. Série prévue : 6 captures portrait en 9:16.

1. **Accueil OFFLIVE** — « La télé devient sociale ».
2. **Accueil ONLIVE** — programme sportif marquant — « Dis ce que tu regardes ».
3. **Tes proches Onlive** — « Vois qui regarde avec toi ».
4. **Discussions** — liste du programme sélectionné.
5. **Chat** — « Réagissez ensemble ».
6. **Contacts** — « Retrouve tes proches sur Onlive ».

Règles : reproduire l’UI réelle actuelle, ne montrer aucune donnée personnelle réelle et ne présenter aucune fonction absente du build.

## Déclarations Play Console à préparer
- Data Safety
- App access
- Ads : Non pour la V1 actuelle
- Content rating / questionnaire IARC
- Target audience and content
- Account deletion URL
- Privacy Policy URL
- Permissions declarations si Play Console les demande pour le manifeste final

## Checklist avant production
- [x] Domaine onlive-app.com accessible en HTTPS
- [x] Privacy Policy publique
- [x] Delete Account publique
- [x] Support public
- [ ] Vérifier support@onlive-app.com
- [ ] Vérifier privacy@onlive-app.com
- [ ] Suppression in-app testée une dernière fois
- [ ] Data Safety complété
- [ ] App access complété avec compte démo
- [ ] Ads = Non confirmé
- [ ] Questionnaire de classification rempli
- [ ] Target audience rempli
- [ ] Permissions contrôlées sur le manifeste final
- [ ] Captures finales importées
- [ ] Build AAB production généré
- [ ] Internal testing Google Play validé
- [ ] Notifications Android app fermée testées sur build production
- [ ] Confirmation e-mail / récupération de mot de passe testées
- [ ] Aucun bouton/debug/test visible dans la version finale

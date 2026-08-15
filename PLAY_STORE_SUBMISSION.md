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

## URLs à fournir
- Privacy Policy : https://onlive-app.com/privacy.html
- Suppression de compte externe : https://onlive-app.com/delete-account.html
- Support / site : https://onlive-app.com/support.html

## Data Safety — brouillon à confirmer avec le code final
### Données personnelles collectées
- Nom/pseudonyme
- Adresse e-mail
- Numéro de téléphone si renseigné / utilisé pour mise en relation
- Photo de profil
- Identifiant utilisateur
- Token push
- Statut Onlive/Offlive
- Programme sélectionné/regardé
- Messages de discussion
- Horodatages nécessaires au fonctionnement
- Contacts du téléphone utilisés pour retrouver des proches et invitations

### Finalités principales
- Fonctionnement de l’application
- Gestion et sécurité du compte
- Fonctionnalités sociales
- Messagerie
- Notifications
- Support et sécurité

### Publicité
Pour la V1 : aucune régie publicitaire tierce et aucun SDK publicitaire prévu.

### Partage / prestataires
Les prestataires techniques actuels comprennent Supabase, Expo, Firebase Cloud Messaging, Apple Push Notification Service et Resend selon les plateformes/fonctions concernées. La qualification exacte « collecté » / « partagé » doit être finalisée dans Data Safety en fonction des flux réellement transmis à chaque service.

## Suppression de compte Google Play
Onlive permet la création de compte : Google Play exige donc :
1. une option de suppression dans l’app ;
2. une ressource web externe permettant d’initier la suppression ;
3. la suppression des données associées au compte, sauf conservation légitime clairement annoncée.

Parcours in-app actuel : photo de profil → Compte → Supprimer mon compte.
URL externe prévue : https://onlive-app.com/delete-account.html

## App Access / accès reviewer
Créer un compte démo stable et transmettre les identifiants dans « App access » si le reviewer ne peut pas accéder aux fonctions sans connexion.

Préparer les instructions :
- se connecter ;
- sélectionner un programme ;
- passer Onlive ;
- consulter les proches Onlive ;
- discuter uniquement lorsqu’un proche est sur le même programme.

## Permissions Android actuellement déclarées
- READ_CONTACTS
- POST_NOTIFICATIONS
- CAMERA

L’accès photo est géré par expo-image-picker selon le système.

### Point critique Contacts
Onlive utilise actuellement READ_CONTACTS. La nouvelle politique Google sur l’accès large aux contacts entre en vigueur le 28 octobre 2026 pour les apps ciblant Android 17 / API 37+ : il faudra soit utiliser Android Contact Picker si cela suffit, soit justifier dans Play Console pourquoi l’accès large aux contacts est indispensable à la fonctionnalité principale.

Pour Onlive, documenter précisément pourquoi le matching automatique de l’ensemble du carnet d’adresses serait nécessaire si READ_CONTACTS est conservé. À réévaluer avant toute montée vers target API 37+.

## Captures Google Play
Prévoir au moins 4 visuels portrait de qualité, idéalement 6 pour garder la même narration qu’iOS :
1. OFFLIVE — La télé devient sociale
2. ONLIVE — match marquant type PSG–OM
3. Proches regardant le même programme
4. Chat autour du programme
5. Notification avec proche + programme + aperçu
6. Contacts / retrouver ses proches

Ne pas inventer de composants inexistants dans l’app. N’utiliser aucune donnée personnelle réelle.

## Déclarations Play Console à préparer
- Data Safety
- App access
- Ads : « Non » pour la V1 sans publicité
- Content rating / questionnaire IARC
- Target audience and content
- Account deletion URL
- Privacy Policy URL
- Permissions declarations si demandées

## Checklist avant production
- [ ] Domaine onlive-app.com accessible en HTTPS
- [ ] Privacy Policy publique
- [ ] Delete Account publique
- [ ] Suppression in-app testée réellement
- [ ] Data Safety complété
- [ ] App access complété avec compte démo
- [ ] Déclaration Ads = Non si aucune pub n’est intégrée
- [ ] Questionnaire de classification rempli
- [ ] Permissions contrôlées sur le manifeste final
- [ ] Build AAB production généré
- [ ] Internal testing Google Play validé
- [ ] Notifications Android app fermée testées sur le build de production
- [ ] Confirmation mail / récupération de mot de passe testées
- [ ] Aucun bouton/debug/test visible dans la version finale

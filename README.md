# Onlive

Prototype mobile React Native + Expo.

## Tester sur iPhone / Android avec Expo Go

Le projet utilise volontairement Expo SDK 54 pour permettre un test immédiat sur téléphone avec Expo Go.

1. Ouvrir le Codespace du dépôt `Onlive`.
2. Dans le terminal :

```bash
npm install
npx expo start --tunnel
```

3. Installer **Expo Go** sur le téléphone.
4. Scanner le QR code affiché par Expo :
   - iPhone : avec l’app Appareil photo.
   - Android : depuis Expo Go.
5. L’app Onlive s’ouvre sur le téléphone.

Après une modification du code, Expo recharge l’app automatiquement ou propose un rechargement.

## Prototype actuel

- écran inscription / connexion ;
- boutons Apple et Google déjà prévus dans l’interface ;
- accueil inspiré de Weez ;
- statut Offlive / Onlive ;
- carrousel de programmes TV ;
- filtres Tous, Divertissement, Film, Série, Sport, Foot ;
- clic sur un programme pour passer Onlive ;
- liste des proches Onlive ;
- accès aux contacts du téléphone ;
- invitation d’un contact via la feuille de partage native.

## Prochaine étape

Brancher une authentification réelle (e-mail/mot de passe + Apple + Google), la base utilisateurs/contacts, puis alimenter automatiquement les programmes TV du jour via l’API prévue pour Onlive.

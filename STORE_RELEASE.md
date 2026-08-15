# Onlive — Préparation App Store & Google Play

## Identité de l'app
- Nom : Onlive
- Bundle ID iOS : com.romainmannino.onlive
- Package Android : com.romainmannino.onlive
- Version de lancement prévue : 1.0.0
- Catégorie principale proposée : Réseaux sociaux
- Catégorie secondaire proposée : Divertissement

## Positionnement Store
Onlive permet de dire à ses proches ce que l'on regarde en direct, de voir qui regarde le même programme et de discuter autour d'un programme TV ou d'un événement sportif.

### Sous-titre court proposé
Regarde. Partage. Discute en direct.

### Description courte Google Play
Dis à tes proches ce que tu regardes et discute avec ceux qui suivent le même programme.

### Description longue proposée
Onlive transforme la télévision et le sport en direct en expérience sociale privée.

Choisis ce que tu regardes, passe Onlive et vois immédiatement quels proches sont connectés. Lorsqu'un proche regarde le même programme, vous pouvez ouvrir une discussion et réagir ensemble en direct.

Fonctionnalités :
- sélection d'un programme TV ou sportif en direct ;
- statut Onlive / Offlive ;
- détection de proches déjà inscrits à partir des contacts ;
- discussions liées au programme regardé ;
- notifications de messages et d'activité ;
- photo de profil ;
- invitations de proches.

Onlive n'est pas un service de streaming : l'application ne diffuse pas les programmes TV et sportifs. Elle crée un espace social autour de ce que vous regardez déjà.

## Mots-clés App Store proposés
onlive,tv,direct,sport,amis,discussion,live,programme,proches,social

## Captures à produire
1. Accueil — choix d'un programme en direct
2. Statut ONLIVE + proches regardant le même programme
3. Discussion autour d'un programme
4. Notifications avec nom du proche + programme + message
5. Contacts — proches déjà sur Onlive

Important : utiliser des comptes de démonstration fictifs dans les captures Store et éviter toute donnée personnelle réelle.

## Conformité à terminer avant soumission
- [ ] Politique de confidentialité publique sur https://onlive-app.com/privacy
- [ ] Page publique de suppression de compte sur https://onlive-app.com/delete-account
- [ ] Option de suppression de compte directement dans l'app
- [ ] Suppression effective des données associées au compte
- [ ] Lien vers la politique de confidentialité accessible dans l'app
- [ ] Formulaire Data Safety Google Play complété
- [ ] App Privacy Apple complétée
- [ ] SMTP Resend vérifié avec onlive-app.com
- [ ] E-mails de confirmation/récupération brandés Onlive
- [ ] Test app fermée : notifications iOS + Android
- [ ] Test nouveau compte : confirmation mail + reconnexion
- [ ] Test mot de passe oublié
- [ ] Test suppression de compte

## Données / permissions à déclarer
À confirmer précisément au moment de remplir les formulaires Store selon le code final :
- adresse e-mail ;
- numéro de téléphone si renseigné ;
- nom / profil ;
- photo de profil ;
- contacts du téléphone utilisés pour faire correspondre les proches ;
- identifiants utilisateur et tokens push ;
- statut Onlive / programme regardé ;
- messages de discussion ;
- données techniques nécessaires aux notifications et à l'authentification.

## Points produit sensibles pour la review
- Onlive ne diffuse aucun contenu audiovisuel.
- Les images et noms de programmes affichés doivent être utilisables légalement dans l'app et les captures Store.
- Les contacts ne doivent servir qu'à retrouver les proches déjà inscrits / invitations, conformément au texte de permission.
- Les discussions expirées ne doivent plus être accessibles lorsque le programme est terminé.
- Un utilisateur Offlive ne doit pas pouvoir envoyer de message.
- Deux utilisateurs ne peuvent discuter que s'ils regardent le même programme actif.

## Builds de production
Quand la checklist fonctionnelle est validée :

```bash
npx eas-cli@latest build --profile production --platform android
npx eas-cli@latest build --profile production --platform ios
```

Puis soumission via EAS / App Store Connect / Google Play Console.

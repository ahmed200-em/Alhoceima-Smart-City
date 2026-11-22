# SmartCity Al Hoceima

Portail citoyen de démonstration en français. Il réunit un annuaire de services, le suivi des signalements et un agenda local. L’interface reprend la maquette fournie, avec la typographie Poppins, la palette bleu et sarcelle et les illustrations de la baie.

## Installation

Prérequis : Node.js 20.19+ ou 22.12+ et npm.

```bash
npm ci
npm run dev
```

Ouvrir [http://localhost:5173](http://localhost:5173). Pour compiler puis prévisualiser le résultat :

```bash
npm run build
npm run preview
```

Le build génère le dossier `dist/`. Sur un hébergement statique, configurer le renvoi des routes de l’application vers `index.html` pour permettre l’ouverture directe d’une fiche.

## Parcours

| Page | Fonction |
| --- | --- |
| Accueil | Indicateurs de démonstration, météo d’Al Hoceima, accès rapides, dernières annonces et agenda |
| Services | Recherche par mot-clé, filtres par catégorie et fiches avec horaires et informations pratiques |
| Signaler un problème | Formulaire avec validation, photo facultative, récapitulatif et référence unique après enregistrement |
| Mon tableau de bord | Compteurs, recherche et filtres En attente, En cours et Résolu. Chaque fiche affiche son historique et sa progression |
| Actualités et événements | Recherche, filtres par type et fiches des annonces et des événements |
| Administration démo | Mise à jour du statut d’un signalement depuis une vue accessible par son adresse directe |

Pour essayer le suivi, créer un signalement, noter sa référence et ouvrir la fiche. Ouvrir **Administration démo** par son adresse directe, choisir **En cours** puis enregistrer. Revenir à la fiche pour retrouver la mise à jour et son horodatage. Les exemples inclus permettent également d’explorer les trois statuts dès le premier lancement.

## Organisation du code

```text
src/
  components/   Éléments partagés, dont la marque et la carte météo
  context/      État des signalements partagé entre les pages
  data/         Services, annonces, événements et signalements fictifs
  hooks/        Gestion des états de la requête météo
  layouts/      Navigation, contenu principal et pied de page
  pages/        Accueil, annuaire, actualités, signalements et page 404
  services/     Appels HTTP et lecture/écriture dans localStorage
  utils/        Formatage et traitement des photos de signalement
  styles.css    Thème Tailwind, styles de base et styles réutilisables
public/         Logo et illustrations fournies pour le projet
```

React et JSX composent les écrans. React Router rend les fiches accessibles par URL et conserve les filtres pris en charge dans l’adresse. Tailwind CSS gère la mise en page responsive et les styles partagés.

Chaque page et composant visuel importe une feuille CSS du même nom, placée à côté de son fichier JSX. Par exemple, modifiez les liens de navigation dans `src/layouts/AppLayout.jsx` et leur apparence dans `src/layouts/AppLayout.css`. Les styles des contrôles partagés entre les écrans de signalement se trouvent dans `src/pages/reports/ReportUI.css`.

## Météo et données locales

L’accueil utilise Fetch API pour interroger la [Weather Forecast API d’Open-Meteo](https://open-meteo.com/en/docs) aux coordonnées d’Al Hoceima, dans le fuseau `Africa/Casablanca`. Il demande la température, le code météo et l’indicateur jour/nuit. La carte affiche le chargement, la réponse ou un bouton **Réessayer** après un échec. L’appel expire après huit secondes et ne requiert aucune clé pour cette démonstration.

Les horaires, chiffres, annonces, événements, références et coordonnées des services sont des exemples fictifs. Les images générées fournies avec le projet illustrent les pages.

Les signalements et leurs changements de statut sont enregistrés dans `localStorage` sous la clé `smartcity-al-hoceima-reports-v1`. Les nouveaux signalements commencent **En attente**. Les photos sont vérifiées et redimensionnées avant l’enregistrement. Un message permet de retirer la photo et de réessayer si l’espace disponible est insuffisant.

La démonstration fonctionne dans le navigateur et sur l’origine utilisés pour l’ouvrir. Elle est sans comptes partagés, sans serveur municipal et sans transmission réelle des signalements. L’administration démo est ouverte pour permettre le test du parcours. Effacer les données du site réinitialise les signalements à leurs valeurs d’exemple.

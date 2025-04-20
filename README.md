Ces informations ne sont plus à jour, et une mise à jour est prévue prochainement. Si vous souhaitez nous suggérer des changements sur cette page, [créez un ticket](https://gitlab.com/minteck-projects/projects/horizon/issues)...
<hr>

# Horizon
## Qu'est-ce que Horizon ?
Horizon est un Bot Discord (logiciel permettant d'automatiser certaines actions) qui peut être contrôlé via une commande, par **Horizon.Data** ou **Minteck**.
Ce Bot Discord est hébergé sur un serveur de **Minteck Projects** !
## Qui s'occupe de Horizon ?
C'est **Minteck** qui se charge du développement, et **Horizon.Data** qui se charge de donner les idées et de valider les changements.
## Quelles sont les commandes ?
### Depuis un serveur
*  `> [message]` permet de demander à Horizon d'envoyer un message (supprime le message d'invocation)
*  `><` active ou désactive le mode Test
*  `><d` affiche les informations de diagnostic requis
*  `><c` obtient les rapports de plantages
*  `><r` redémarre le bot en rechargant le code
*  `><u` annule la dernière action (souvent un message envoyé) effectué par le bot
*  `><l` obtient le fichier journal du bot
*  `><g [jeu]` modifie le message de jeu (Game Activity) du bot
*  `><mj` rejoint un salon vocal
*  `><ml` quitte un salon vocal
*  `><md` affiche les informations de diagnostic concernant l'audio

### Depuis les messages privés
*  `> [message]` permet de demander à Horizon d'envoyer un message (supprime le message d'invocation)
*  `><` active ou désactive le mode Test
*  `><c` obtient les rapports de plantages
*  `><r` redémarre le bot en rechargant le code
*  `><g [jeu]` modifie le message de jeu (Game Activity) du bot

### Qui seront prochainement ajoutées
*  `><mm` activer/désactiver le microphone
*  `><mc` activer/désactiver le sourd (deafen)
*  `><s [moteur] [requête]` recherchera le contenu demandé sur Internet

## Et en plus ?
En plus ? Et bien, Horizon est capable de :
*  Enregistrer quand l'accès à été refusé à un utilisateur
*  Éviter de planter en capturant les erreurs de connexion
*  Enregistrer les rapports de plantage pour analyse future
*  Envoyer un message privé à **Horizon.Data** lorsqu'Horizon est mentionné

# Configuration
La configuration d'Horizon est stockée en langage `JSON`, dans le fichier `config\config.json`.<br>
**Astuce :** Pensez à conserver le fichier `config\config.json.orig` que vous pourrez restaurer au cas où votre configuration ne fonctionne pas.
Pour la modifier, il faut savoir ce que vous faites ! Car modifier certaines propriétés à des valeurs invalides peuvent causer des problèmes avec Horizon...<br>
Si vous n'êtes pas trop sûr de comment procéder, vous pouvez toujours [créer un ticket](https://gitlab.com/minteck-projects/projects/horizon/issues) afin de demander de l'aide...
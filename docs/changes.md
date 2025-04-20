# Journal des changements de **Horizon**
## Version 1.9
  - Ajout de l'intégration avec Projectpédia, et des commandes `pp tp` et `pp p`
  - Ajout de la commande de maintenance (`mtnmode`)
  - Correction de bugs, parce qu'il en faut quand même un peu...
  
## Version 1.8
  - Nous avons ajouté un système de Sharding, qui divise le bot en plusieurs processus, chacun étant capable d'accepter 2 500 serveurs. Le Sharding peut aussi être utile pour améliorer les performances. Par défaut, Horizon en dispose de 8 (soit 20 000 serveurs).
  - Nous avons ajouté la commande `hg t*` qui permet de traduire n'importe quel texte dans une de ces langues :
    - `hg tf` pour traduire *vers* le **français**
	- `hg te` pour traduire *vers* l'**anglais**
	- `hg tj` pour traduire *vers* le **japonais**
	- `hg tl` pour traduire *vers* le **latin**

## Version 1.7
  - Il est désormais possible de faire des dons aux autres utilisateurs de Horigame, il suffit d'utiliser la commande `hg give`
  - Un cooldown à été appliqué, pour évité l'abus d'XP de Horigame et le DDoS des commandes.
  
## Version 1.6
  - Horigame à été créé ! Il va rendre Horizon plus utile et dynamique, et vous permettra de vous amusez... Il suffit de commencer avec `hg init`
  - Le temps de modification du message de jeu de `dynamicGameActivity` à été modifié, c'est maintenant 10 secondes...
  
## Version 1.5
  - La propriété `dynamicGameActivity` à été incluse, et permet de modifier automatiquement le message de jeu toutes les 5 secondes.

## Version 1.4.3
  - Finalisation du système de gestion audio
  - Ajout de l'option `--kernel-verbose`

## Version 1.4.1
  - Amélioration des commandes `><mj` et `><ml`
  - Ajout de la commande de déboggage `><md`

## Version 1.4
  - Application du décallage horaire d'Europe Centrale au log
  - Ajout de l'option voiceChannel

## Version 1.3.2
  - Résolution en urgence d'un problème avec la commande `><l`

## Version 1.3.1
  - Résolution en urgence d'un problème avec la commande `><d`

## Version 1.3
  - Résolution du message d'erreur avec `fs.writeFile`
  - Résolution du problème d'espacement du sendMessage
  - Ajout d'une commande pour obtenir le journal système
  - Ajout d'une commande pour changer le message de jeu

## Version 1.2.1
  - Correction d'un problème empêchant le démarrage du bot

## Version 1.2
  - Amélioration de la console (plus de détails)
  - Traçabilité des refus d'accès aux utilisateurs
  - Syntaxe globale pour la console
  - Capture des erreurs de communication
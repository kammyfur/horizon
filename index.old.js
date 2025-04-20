//
//  _   _            _
// | | | | ___  _ __(_)_______  _ __
// | |_| |/ _ \| '__| |_  / _ \| '_ \
// |  _  | (_) | |  | |/ / (_) | | | |
// |_| |_|\___/|_|  |_/___\___/|_| |_|
//
// Horizon Discord Bot version 1.4.3
//
// Créé par Horizon et Minteck
// Copyright (c) 2019, Horizon
//
// Horizon est distribué sous licence Minteck Projects PLA 1.0.
// Pour en savoir plus, vous pouvez accéder à ce site Internet :
//    http://projectpedia.referata.com/wiki/Licence:Minteck_Projects_PLA

var time = process.uptime();
console.log("[" + time + "] Init tokens preloader")

// Définition du token.
//let token = "TokenDuBotTest" // Utilise le bot test
let token = "TokenDuBotFinal" // Utilise le bot final

// ChangeLog, Mise à jour 1.4.3 :
//  - Finalisation du système de gestion audio
//  - Ajout de l'option --kernel-verbose
//
// ChangeLog, Mise à jour 1.4.2 :
//  - Multiples patches
//
// ChangeLog, Mise à jour 1.4.1 :
//  - Amélioration des commandes ><mj et ><ml
//  - Ajout de la commande de déboggage ><md
//
// ChangeLog, Mise à jour 1.4.3 :
//  - Application du décallage horaire d'Europe Centrale au log
//  - Ajout de l'option voiceChannel
//
// ChangeLog, Mise à jour 1.3.2 :
//  - Résolution en urgence d'un problème avec la commande ><l
//
// ChangeLog, Mise à jour 1.3.1 :
//  - Résolution en urgence d'un problème avec la commande ><d
//
// ChangeLog, Mise à jour 1.3 :
//  - Résolution du message d'error avec fs.writeFile
//  - Résolution du problème d'espacement du sendMessage
//  - Ajout d'une commande pour obtenir le journal système
//  - Ajout d'une commande pour changer le message de jeu
//
// ChangeLog, Mise à jour 1.2.1 :
//  - Correction d'un problème empêchant le démarrage du bot
//
// ChangeLog, Mise à jour 1.2 :
//  - Amélioration de la console (plus de détails)
//  - Traçabilité des refus d'accès aux utilisateurs
//  - Syntaxe globale pour la console
//  - Capture des erreurs de communication

var time = process.uptime();
//var uptime = (time + "").toHHMMSS();
console.log("[" + time + "] Init libs preloader")
const underscorelib = require('underscore');
const Discord = require('discord.js');
const client = new Discord.Client();
const shard = new Discord.ShardClientUtil(client);
const os = require('os');
const fs = require('fs');
var time = process.uptime();
//var uptime = (time + "").toHHMMSS();
console.log("[" + time + "] Libs loaded")
var time = process.uptime();
//var uptime = (time + "").toHHMMSS();
console.log("[" + time + "] Init vars definer")
let testMode = false
let lstmsg = ""
let component = "krnl"
let mChannel = "no"
let eemsg = ""
let connected = false
let loginfo = "nothing"
let vocalChannel = null

var time = process.uptime();
//var uptime = (time + "").toHHMMSS();
console.log("[" + time + "] Checking code")

client.on('ready', () => {
  loginfo = "Connexion établie"
  showLog();
  if (client.user.username == "Horizon") {
    client.user.setActivity("Forza Horizon 4").catch(console.error);
    testMode = false
  } else {
    client.user.setActivity("Horizon - Mode test").catch(console.error);
    testMode = true
  }
});

client.on('message', function (msg) {
	if (msg.guild !== null) {
	let HorizonDataId = "<@392012706279981066>"
	let HorizonTestBotId = "<@546770319575089175>"
	let HorizonBotId = "<@546770319575089175>"
	let text = msg.content
	if(text.indexOf("<@546770319575089175>") > -1 || text.indexOf("<@546770319575089175>") > -1) {
		members = msg.channel.members
		guildMember = msg.channel.members.find('id', '392012706279981066');
		loginfo = "Message privé envoyé à Horizon.Data :" + msg.content
		showLog();
		if (testMode == false) {
		guildMember.send("**__" + msg.author + "__ a mentionné __Horizon__ sur le serveur __" + msg.guild.name + "__, dans le salon __" + msg.channel + "__. Le message était :**\n\n" + msg.content)
		}else{
			guildMember.send("**__" + msg.author + "__ a mentionné __Horizon__ sur le serveur __" + msg.guild.name + "__, dans le salon __" + msg.channel + "__. Le message était :**\n\n" + msg.content + "\n```\nCela a pris approximativement " + client.ping + "ms.\nDemandé par " + msg.author + ", et c'est un Mega-Lucario !```")
		}
}}})

client.on('message', msg => {
	lstmsg = msg
})

client.on('message', msg => {
	lstmsg = msg
  if (msg.content.startsWith('> ')) {
	  component = "sendMessage"
	  lstmsg = msg
	  if (msg.author.username == "Minteck | ルカリオ" || msg.author.username == "Horizon.Data") {
                let args = msg.content.split(' ');
                args.shift();
                msg.delete();
                let text = args.join(' ')
		if (testMode == false) {
		    msg.channel.send(text).catch();
		  } else {
		    msg.channel.send(text + "\n```\nCela a pris approximativement " + client.ping + "ms.\nDemandé par " + msg.author + ", et c'est un Mega-Lucario !```").catch();
		  }
				if (msg.guild) {
                loginfo = "Message envoyé sur le salon #" + msg.channel.name + " sur le serveur " + msg.guild.name + " : " + text
				showLog();
				} else {
				loginfo = "Message envoyé via DM à l'utilisateur @" + msg.author.tag + " : " + msg.content
				showLog();
  }}else{
				if (msg.guild) { loginfo = "Rejet d'accès à l'utilisateur @" + msg.author.username + "#" + msg.author.tag + " (" + msg.author.id + ") depuis le serveur " + msg.guild.name + " (#" + msg.channel.name + ")" + " | " + msg.content } else { loginfo = "Rejet d'accès à l'utilisateur @" + msg.author.tag + " (" + msg.author.id + ") via messages privés | " + msg.content }
				showLog();
            }
	  component = "krnl"
}});

client.on('message', msg => {
	lstmsg = msg
  if (msg.content.startsWith('><g ')) {
	  component = "setGameActivity"
	  lstmsg = msg
	  if (msg.author.username == "Minteck | ルカリオ" || msg.author.username == "Horizon.Data") {
                let args = msg.content.split(' ');
                args.shift();
                msg.delete();
                let text = args.join(' ')
				client.user.setActivity(text)
				if (msg.guild) {
                loginfo = "Message de jeu modifié à partir #" + msg.channel.name + " sur le serveur " + msg.guild.name + " : " + text
				showLog();
				} else {
				loginfo = "Message de jeu modifié à partir d'un salon DM de l'utilisateur @" + msg.author.tag + " : " + text
				showLog();
  }}else{
				if (msg.guild) { loginfo = "Rejet d'accès à l'utilisateur @" + msg.author.username + "#" + msg.author.tag + " (" + msg.author.id + ") depuis le serveur " + msg.guild.name + " (#" + msg.channel.name + ")" + " | " + msg.content } else { loginfo = "Rejet d'accès à l'utilisateur @" + msg.author.tag + " (" + msg.author.id + ") via messages privés | " + msg.content }
				showLog();
            }
	  component = "krnl"
}});

Object.defineProperty(global, '__stack', {
get: function() {
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function(_, stack) {
            return stack;
        };
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        var stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
    }
});

Object.defineProperty(global, '__line', {
get: function() {
        return __stack[1].getLineNumber();
    }
});

Object.defineProperty(global, '__function', {
get: function() {
        return __stack[1].getFunctionName();
    }
});

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

process.on('uncaughtException', function (err) {
	console.log(err);
	console.error();
	if (err == "Error: Unhandled \"error\" event. ([object Object])") {}else{
	members = lstmsg.channel.members
	guildMember = members.find('id', '294910706250285056')
	//var error = console.error()
	let system = os.type()
	let release = os.release()
	let cpuarch = os.arch()
	let freeram = os.freemem()
	let totalram = os.totalmem()
	var readablefreeram = Math.floor(freeram/1000000);
	var readabletotalram = Math.floor(totalram/1000000);
	let cpu = os.cpus
	let cpumodel = cpu.model
	let eemsgid = getRandomInt(9)
	let crashid = getRandomInt(50000)
	//let err = result
	client.destroy();
	client.login(token);
	if (eemsgid === 0) {
		eemsg = "Je suis revenu, pour vous jouer un mauvais tour !"
	}
	if (eemsgid === 1) {
		eemsg = "Les amis, c'est le moment où la science va ouvrir la voie ! (boom)"
	}
	if (eemsgid === 2) {
		eemsg = "Oups... J'ai peut être été trop loin..."
	}
	if (eemsgid === 3) {
		eemsg = "Je savais que c'était pas une bonne idée d'utiliser Windows 98..."
	}
	if (eemsgid === 4) {
		eemsg = "Je code avec le Q ! la la la la la la laaaa"
	}
	if (eemsgid === 5) {
		eemsg = "Mega-Évolution ! (boom) Oups..."
	}
	if (eemsgid === 6) {
		eemsg = "Fartal Error, j'ai fait prout prout..."
	}
	if (eemsgid === 7) {
		eemsg = "1 + 1 = 3, et 3 + 3 = 1"
	}
	if (eemsgid === 8) {
		eemsg = "Let's Go Pikachu, ou Let's Go Évoli ?"
	}
	if (eemsgid === 9) {
		eemsg = "J'en reste sans voix..."
	}
	if (client.lastMessageID == null) {
	lstmsg.channel.send("```Oups... Désolé, une erreur s'est produite... Je viens de transmettre un rapport à mon développeur, et je reviens vite !```")
	fs.appendFile('crashes.log', err + "\n     at function " + __function + ", component " + component + "\n\n=> " + eemsg + "\n\n" + "                       Version d'Horizon : 1.4.3\n                         Serveur courant : main-shared\n                   Canal de mises à jour : nightly\n                 Temps de fonctionnement : " + client.uptime + "ms\n                                  Avatar : " + client.user.displayAvatarURL + "\n                                  Créé à : " + client.user.createdTimestamp + "\n                      Identifiant du bot : " + client.user.id + "\n          Identifiant du dernier message : " + client.user.lastMessageID + "\nServeurs sur lesquels le bot est présent : " + client.guilds.size + "\n                        Temps de latence : " + client.pings + "ms" + " (moy. " + client.ping + "ms)\n                    Identifiant du Shard : " + shard.id + "\n                  Plate-forme du serveur : " + system + "\n              Version de l'OS du serveur : " + release + "\n                 Architecture du serveur : " + cpuarch + "\n                            Mémoire vive : " + readablefreeram + " Mio libres sur " + readabletotalram + " Mio\n                   Processeur du serveur : " + cpumodel + "\n                          Nom du serveur : " + message.guild.name  + "\n          Chemin vers l'îcone du serveur : " + message.guild.iconURL + "\n                   Membres de ce serveur : " + message.guild.memberCount + "\n                 Propriétaire du serveur : " + message.guild.owner.displayName + "\n                       Région du serveur : " + message.guild.region + "\n               Niv. de vérif. du serveur : " + message.guild.verificationLevel + "\n              Acronyme du nom du serveur : " + message.guild.nameAcronym + "\n                 Salon d'absence (vocal) : " + message.guild.afkChannel.name + "\n   Tps. avant dépl. dans le salon d'abs. : " + message.guild.afkTimeout + " sec." + "\n\n-----------------------------------------\n\n", function (err) {
		if (err) throw err;
		console.log("Rapport de plantage sauvegardé sous le nom 'crashed.log'");
	});
	guildMember.send("**Rapport de plantage de Horizon** - `#" + crashid + "`\n\nBonjour <@294910706250285056>,\nJ'ai une très mauvaise nouvelle à vous annoncer... Je viens de cesser de fonctionner...\nAfin d'éviter de futurs problèmes, j'ai automatiquement redémarré...\nIl n'y a rien d'autre à faire, mis à part mettre à jour le code si le problème persiste...\n\nVoici des informations pouvant vous aider à la résolution de ce problème :" + "```" + err + "\n     at function " + __function + ", component " + component + "\n\n=> " + eemsg + "\n\n" + "                       Version d'Horizon : 1.4.3\n                         Serveur courant : main-shared\n                   Canal de mises à jour : nightly\n                 Temps de fonctionnement : " + client.uptime + "ms\n                                  Avatar : " + client.user.displayAvatarURL + "\n                                  Créé à : " + client.user.createdTimestamp + "\n                      Identifiant du bot : " + client.user.id + "\n          Identifiant du dernier message : " + client.user.lastMessageID + "\nServeurs sur lesquels le bot est présent : " + client.guilds.size + "\n                        Temps de latence : " + client.pings + "ms" + " (moy. " + client.ping + "ms)\n                    Identifiant du Shard : " + shard.id + "\n                  Plate-forme du serveur : " + system + "\n              Version de l'OS du serveur : " + release + "\n                 Architecture du serveur : " + cpuarch + "\n                            Mémoire vive : " + readablefreeram + " Mio libres sur " + readabletotalram + " Mio\n                   Processeur du serveur : " + cpumodel + "\n                          Nom du serveur : " + message.guild.name  + "\n          Chemin vers l'îcone du serveur : " + message.guild.iconURL + "\n                   Membres de ce serveur : " + message.guild.memberCount + "\n                 Propriétaire du serveur : " + message.guild.owner.displayName + "\n                       Région du serveur : " + message.guild.region + "\n               Niv. de vérif. du serveur : " + message.guild.verificationLevel + "\n              Acronyme du nom du serveur : " + message.guild.nameAcronym + "\n                 Salon d'absence (vocal) : " + message.guild.afkChannel.name + "\n   Tps. avant dépl. dans le salon d'abs. : " + message.guild.afkTimeout + " sec.\n```").catch()
	component = "exceptionHandlerer"
	}}
	component = "krnl"
});

function restartBot() {
	client.destroy();
	client.login(token);
};

client.on('message', message => {
	component = "testModeSwitch"
	lstmsg = message
    if (message.content == '><') {
		component = "testModeSwitch"
        if (message.author.username == "Minteck | ルカリオ" || message.author.username == "Horizon.Data") {
			if (testMode == true) {
				message.delete()
                message.channel.send("```\nMode de test désactivé\n```").catch();
                loginfo = "Mode test désactivé"
				showLog();
				testMode = false
				lstmsg = message
				client.user.setActivity("Forza Horizon 4");
			}else{
				message.delete()
				message.channel.send("```\nMode de test activé\n```" + "\n```\nCela a pris approximativement " + client.ping + "ms.\nDemandé par " + message.author + ", et c'est un Méga-Lucario !```").catch();
				lstmsg = message
                loginfo = "Mode test activé"
				showLog();
				testMode = true
				client.user.setActivity("Horizon - Mode test");
			}
    }else{
				if (message.guild) { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.username + "#" + message.author.tag + " (" + message.author.id + ") depuis le serveur " + message.guild.name + " (#" + message.channel.name + ")" + " | " + message.content } else { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.tag + " (" + message.author.id + ") via messages privés | " + message.content }
				showLog();
            }
	component = "krnl"
}});

client.on('message', function (message) {
	lstmsg = message
    if (message.content == '><c') {
		message.delete()
		component = "getCrashReports"
        if (message.author.username == "Minteck | ルカリオ" || message.author.username == "Horizon.Data") {
			const reports = new Discord.Attachment('crashes.log')
			lstmsg = message
			loginfo = "Rapport de plantage envoyé à @" + msg.author.tag
			showLog();
			if (testMode == false) {
			message.author.send("Bonjour " + message.author + ",\nComme vous me l'avez demandé, voici un fichier contenant tous les rapports de plantage que j'ai pu enregistrer...")
			message.author.send(reports)
			}else{
				message.author.send("Bonjour " + message.author + ",\nComme vous me l'avez demandé, voici un fichier contenant tous les rapports de plantage que j'ai pu enregistrer...")
				message.author.send(reports)
				message.author.send("\n```\nCela a pris approximativement " + client.ping + "ms.\nDemandé par " + message.author + ", et c'est un Méga-Lucario !```")
			}
            }else{
				if (message.guild) { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.username + "#" + message.author.tag + " (" + message.author.id + ") depuis le serveur " + message.guild.name + " (#" + message.channel.name + ")" + " | " + message.content } else { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.tag + " (" + message.author.id + ") via messages privés | " + message.content }
				showLog();
            }
    }
	component = "krnl"
});

client.on('message', function (message) {
	lstmsg = message
    if (message.content == '><l') {
		message.delete()
		component = "getSystemLogs"
        if (message.author.username == "Minteck | ルカリオ" || message.author.username == "Horizon.Data") {
			const reports = new Discord.Attachment('global.log')
			lstmsg = message
			loginfo = "Fichier journal envoyé à @" + message.author.tag
			showLog();
			if (testMode == false) {
			message.author.send("Bonjour " + message.author + ",\nComme vous me l'avez demandé, voici un fichier contenant toutes les actions que j'ai pu effectuer...")
			message.author.send(reports)
			}else{
				message.author.send("Bonjour " + message.author + ",\nComme vous me l'avez demandé, voici un fichier contenant toutes les actions que j'ai pu effectuer...")
				message.author.send(reports)
				message.author.send("\n```\nCela a pris approximativement " + client.ping + "ms.\nDemandé par " + message.author + ", et c'est un Méga-Lucario !```")
			}
            }else{
				if (message.guild) { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.username + "#" + message.author.tag + " (" + message.author.id + ") depuis le serveur " + message.guild.name + " (#" + message.channel.name + ")" + " | " + message.content } else { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.tag + " (" + message.author.id + ") via messages privés | " + message.content }
				showLog();
            }
    }
	component = "krnl"
});

client.on('message', function (message) {
	if (message.guild) {
	lstmsg = message
    if (message.content.startsWith('><d')) {
		component = "debugInfo"
        if (message.author.username == "Minteck | ルカリオ" || message.author.username == "Horizon.Data") {
			message.delete()
			lstmsg = message
			if (message.guild) { loginfo = "Distribution des informations de déboggage sur le salon #" + message.channel.name + " du serveur " + message.guild.name } else { loginfo = "Distribution des informations de déboggage par message privé à @" + message.author.tag }
			showLog();
			let system = os.type()
			let release = os.release()
			let cpuarch = os.arch()
			let freeram = os.freemem()
			let totalram = os.totalmem()
			var readablefreeram = Math.floor(freeram/1000000);
			var readabletotalram = Math.floor(totalram/1000000);
			let cpu = os.cpus
			let cpumodel = cpu.model
			message.channel.send("```\nMais dis donc, tu es un petit Riolu toi !\nVoici quelques informations de déboggage qui peuvent t'être utiles durant ton chemin !\n\n                       Version d'Horizon : 1.4.3\n                         Serveur courant : main-shared\n                   Canal de mises à jour : nightly\n                 Temps de fonctionnement : " + client.uptime + "ms\n                                  Avatar : " + client.user.displayAvatarURL + "\n                                  Créé à : " + client.user.createdTimestamp + "\n                      Identifiant du bot : " + client.user.id + "\n          Identifiant du dernier message : " + client.user.lastMessageID + "\nServeurs sur lesquels le bot est présent : " + client.guilds.size + "\n                        Temps de latence : " + client.pings + "ms" + " (moy. " + client.ping + "ms)\n                    Identifiant du Shard : " + shard.id + "\n                  Plate-forme du serveur : " + system + "\n              Version de l'OS du serveur : " + release + "\n                 Architecture du serveur : " + cpuarch + "\n                            Mémoire vive : " + readablefreeram + " Mio libres sur " + readabletotalram + " Mio\n                   Processeur du serveur : " + cpumodel + "\n                          Nom du serveur : " + message.guild.name  + "\n          Chemin vers l'îcone du serveur : " + message.guild.iconURL + "\n                   Membres de ce serveur : " + message.guild.memberCount + "\n                 Propriétaire du serveur : " + message.guild.owner.displayName + "\n                       Région du serveur : " + message.guild.region + "\n               Niv. de vérif. du serveur : " + message.guild.verificationLevel + "\n              Acronyme du nom du serveur : " + message.guild.nameAcronym + "\n                 Salon d'absence (vocal) : " + message.guild.afkChannel.name + "\n   Tps. avant dépl. dans le salon d'abs. : " + message.guild.afkTimeout + " sec.\n```")
            }else{
				if (message.guild) { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.username + "#" + message.author.tag + " (" + message.author.id + ") depuis le serveur " + message.guild.name + " (#" + message.channel.name + ")" + " | " + message.content } else { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.tag + " (" + message.author.id + ") via messages privés | " + message.content }
				showLog();
            }
}
component = "krnl"
}})

client.on('message', function (message) {
	lstmsg = message
	if (message.guild) {
    if (message.content.startsWith('><md')) {
		component = "debugInfo"
        if (message.author.username == "Minteck | ルカリオ" || message.author.username == "Horizon.Data") {
			message.delete()
			lstmsg = message
			loginfo = "Distribution des informations de déboggage de l'audio sur le salon #" + message.channel.name + " du serveur " + message.guild.name
			showLog();
			if (connected == true) {
			message.channel.send("```\nInformations de déboggage de la musique pour ce petit Gardevoir qui me les a demandées :\n\n" + "               Connexion vocale : " + true + "\n\nInformations du salon vocal :" + "                 Salon courrant : " + vocalChannel.name + "\n                  Salon complet : " + vocalChannel.full + "\n           Débit du salon vocal : " + vocalChannel.bitrate + "\n       Catégorie du salon vocal : " + vocalChannel.parentID + "\n Limite d'utilisateurs du salon : " + vocalChannel.position + "\n      Peut parler dans le salon : " + vocalChannel.speakable + "\n\nInformations sur la connexion au salon :" + "\n        Horizon transmet du son : " + vocalChannel.speaking + "\n           État de la connexion : " + vocalChannel.connection.status + "\n\nInformations concernant la transmission audio sortante :" + "\n                   (actuellement indisponible)\n```")
            }else{
				message.channel.send("```\nInformations de déboggage de la musique pour ce petit Gardevoir qui me les a demandées :\n\n" + "               Connexion vocale : " + "false\n```")
			}}else{
				if (message.guild) { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.username + "#" + message.author.tag + " (" + message.author.id + ") depuis le serveur " + message.guild.name + " (#" + message.channel.name + ")" + " | " + message.content } else { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.tag + " (" + message.author.id + ") via messages privés | " + message.content };
				showLog();
            }
}
component = "krnl"
}})

function requestRestart() {
	loginfo = "Une demande de redémarrage à été reçue. Le client va maintenant redémarrer..."
	showLog();
	process.exit(0);
}

client.on('message', function (message) {
	lstmsg = message
    if (message.content.startsWith('><r')) {
		component = "restartBot"
        if (message.author.username == "Minteck | ルカリオ" || message.author.username == "Horizon.Data") {
			lstmsg = message
			message.delete()
			lstmsg = message
			if (testMode == false) {
			message.author.send("D'accord, je reviens !");
			}else{
				message.author.send("D'accord, je reviens !" + "\n```\nCela a pris approximativement " + client.ping + "ms.\nDemandé par " + message.author + ", et c'est un Méga-Lucario !```");
			}
			setTimeout(requestRestart, 4000);
            }else{
				if (message.guild) { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.username + "#" + message.author.tag + " (" + message.author.id + ") depuis le serveur " + message.guild.name + " (#" + message.channel.name + ")" + " | " + message.content } else { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.tag + " (" + message.author.id + ") via messages privés | " + message.content }
				showLog();
            }
}
component = "krnl"
})

client.on('message', function (message) {
	if (message.guild) {
	lstmsg = message
    if (message.content.startsWith('><u')) {
		lstmsg = message
		component = "undoMessage"
        if (message.author.username == "Minteck | ルカリオ" || message.author.username == "Horizon.Data") {
			message.delete()
			if (client.user.lastMessageID == null) {
				if (testMode == false) {
				message.author.send("**Une erreur s'est produite**\n\nJ'ai essayé d'annuler ma dernière action, mais un problème m'empèche de le faire en ce moment. Voici plus d'informations pouvant vous aider à résourdre ce problème :\n```\nlastMessageID = null\nAucun message n'a été envoyé par le bot depuis son démarrage.\n```")
				loginfo = "Aucune action à annuler trouvée..."
				showLog();
				}else{
					message.author.send("**Une erreur s'est produite**\n\nJ'ai essayé d'annuler ma dernière action, mais un problème m'empèche de le faire en ce moment. Voici plus d'informations pouvant vous aider à résourdre ce problème :\n```\nlastMessageID = null\nAucun message n'a été envoyé par le bot depuis son démarrage.\n```" + "\n```\nCela a pris approximativement " + client.ping + "ms.\nDemandé par " + message.author + ", et c'est un Méga-Lucario !```")
				loginfo = "Aucune action à annuler trouvée..."
			showLog();
				}
			}else{
				client.user.lastMessage.delete()
				loginfo = "Action annulée depuis le salon #" + msg.channel.name + " du serveur " + msg.guild.name + " ( " + client.user.lastMessage.guild.name + " | " + client.user.lastMessage.channel.name + " | " + client.user.lastMessageID + " | " + client.user.lastMessage.content + " | sendMessage )"
				showLog();
	}}else{
				if (message.guild) { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.username + "#" + message.author.tag + " (" + message.author.id + ") depuis le serveur " + message.guild.name + " (#" + message.channel.name + ")" + " | " + message.content } else { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.tag + " (" + message.author.id + ") via messages privés | " + message.content }
				showLog();
            }
	component = "krnl"
}}})

function showLog() {
	var date = new Date();
    var hour = date.getHours() + 1;
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    var time = day + "/" + month + "/" + year + " " + hour + ":" + min + ":" + sec;
	console.log(time + " : " + loginfo)
	fs.appendFile('global.log', "\n" + time + " : " + loginfo, (error) => { /* handle error */ })
}

client.on('message', message => {
  if (!message.guild) return;

  if (message.content === '><mj') {
	  component = "joinVoiceChannel"
	  if (message.author.username == "Minteck | ルカリオ" || message.author.username == "Horizon.Data") {
		  message.delete()
    if (message.member.voiceChannel) {
		if (connected == true) {
          message.author.send(":no_entry: Je suis déjà connecté au salon vocal **`" + vocalChannel.name + '`**. Utilisez `><ml` pour le quitter...');
    } else {
      message.member.voiceChannel.join()
        .then(connection => {
          message.author.send(":white_check_mark: J'ai rejoint le salon vocal **`" + message.member.voiceChannel.name + '`**...');
		  connected = true
		  vocalChannel = connection.channel
		  loginfo = "Connecté à un salon vocal"
		  showLog();
        })
        .catch(console.log);
    }} else {
      message.author.send(":no_entry: Vous n'êtes pas connecté dans un salon vocal. Vous devez en rejoindre un pour que je puisse me connecter...");
    }
  }else{
				if (message.guild) { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.username + "#" + message.author.tag + " (" + message.author.id + ") depuis le serveur " + message.guild.name + " (#" + message.channel.name + ")" + " | " + message.content } else { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.tag + " (" + message.author.id + ") via messages privés | " + message.content }
				showLog();
            }}
	component = "krnl"
});

client.on('message', message => {
  if (!message.guild) return;

  if (message.content === '><ml') {
	  component = "leaveVoiceChannel"
	  if (message.author.username == "Minteck | ルカリオ" || message.author.username == "Horizon.Data") {
		  message.delete()
    if (connected == true) {
          message.author.send(":white_check_mark: J'ai quitté le salon vocal **`" + vocalChannel.name + '`**...');
        vocalChannel.leave()
		connected = false
		loginfo = "Déconnecté du salon vocal"
		showLog();
    } else {
      message.author.send(":no_entry: **Horizon** n'est pas encore connecté à un salon vocal. Utilisez la commande `><mj` pour en rejoindre un...");
    }
  }else{
				if (message.guild) { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.username + "#" + message.author.tag + " (" + message.author.id + ") depuis le serveur " + message.guild.name + " (#" + message.channel.name + ")" + " | " + message.content } else { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.tag + " (" + message.author.id + ") via messages privés | " + message.content }
				showLog();
            }}
	component = "krnl"
});

client.on('disconnect', function () {
    loginfo = "Erreur de communication. Redémarrage du client..."
	showLog();
	setTimeout(requestRestart, 4000);
});

client.on('reconnecting', function () {
    loginfo = "Erreur de communication. Reconnexion en cours..."
	showLog();
});

client.on('error', function (err) {
    loginfo = "Erreur inconnue : " + err
	showLog();
});

var time = process.uptime();
//var uptime = (time + "").toHHMMSS();
console.log("[" + time + "] Loading client")
client.login(token);
var childProcess = require('child_process');
var config = require('../config/config.json')
let testMode = false
let connected = false
let loginfo = "nothing"
let vocalChannel = null
const underscorelib = require('underscore');
const Discord = require('discord.js');
const client = new Discord.Client();
const shard = new Discord.ShardClientUtil(client);
const fs = require('fs');
const os = require('os');
var cpumodel = ""
let processram

const RawMessage = require('../features/rawMessage')
const TestMode = require('../features/testMode')
const RestartBot = require('../features/restartBot')
const SendLogs = require('../features/sendLogs')
const SendCrashes = require('../features/sendCrashes')
const GameActivity = require('../features/gameActivity')
const VoiceChannel = require('../features/voiceChannel')

client.on('message', function (message) {
    let commandUsed = RawMessage.parse(message) ||
    TestMode.parse(message) ||
    RestartBot.parse(message) ||
    SendLogs.parse(message) ||
    SendCrashes.parse(message) ||
    GameActivity.parse(message) ||
    VoiceChannel.parse(message)
})

client.on('message', function (message) {
    if (config.enableRawMessages) {
        if (message.content.startsWith(config.commandsPrefix + config.commandsSuffix + 'g')) {
            if (message.author.username == "Minteck | ルカリオ" || message.author.username == "Horizon.Data") {
                      let args = message.content.split(' ');
                      args.shift();
                      message.delete();
                      let text = args.join(' ')
              if (mode.test == false) {
                  message.author.send("Le message de jeu est maintenant le suivant : **" + text + "**").catch();
                  client.user.setActivity(text).catch();
                } else {
                  message.author.send("Le message de jeu ne peut pas être modifié si le mode Test est activé. Exécutez la commande `><` pour le désactiver." + "\n```\nCela a pris approximativement " + client.ping + "ms.\nDemandé par " + message.author + ", et c'est un Mega-Lucario !```").catch();
                }
                      if (message.guild) {
                      loginfo = "Message de jeu modifié à partir du salon #" + message.channel.name + " sur le serveur " + message.guild.name + " : " + text
                      showLog();
                      } else {
                      loginfo = "Message de jeu modifié à partir d'un salon DM à l'utilisateur @" + message.author.tag + " : " + text
                      showLog();
        }}else{
                      if (message.guild) { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.username + "#" + message.author.tag + " (" + message.author.id + ") depuis le serveur " + message.guild.name + " (#" + message.channel.name + ")" + " | " + message.content } else { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.tag + " (" + message.author.id + ") via messages privés | " + message.content }
                      showLog();
                  }
      }

}});

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
		if (mode.test == false) {
		guildMember.send("**__" + msg.author + "__ a mentionné __Horizon__ sur le serveur __" + msg.guild.name + "__, dans le salon __" + msg.channel + "__. Le message était :**\n\n" + msg.content)
		}else{
			guildMember.send("**__" + msg.author + "__ a mentionné __Horizon__ sur le serveur __" + msg.guild.name + "__, dans le salon __" + msg.channel + "__. Le message était :**\n\n" + msg.content + "\n```\nCela a pris approximativement " + client.ping + "ms.\nDemandé par " + msg.author + ", et c'est un Mega-Lucario !```")
		}
}}})

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
        console.log(err)
        function runScript(scriptPath, callback) {
            var invoked = false;
        
            var process = childProcess.fork(scriptPath);
        
        
            process.on('error', function (err) {
                if (invoked) return;
                invoked = true;
                callback(err);
            });
        
        
            process.on('exit', function (code) {
                if (invoked) return;
                invoked = true;
                var err = code === 0 ? null : new Error('exit code ' + code);
                callback(err);
            });
        
        }
        
        runScript('./libhorizon/errorHandler.js', function (err) {
            if (err) throw err;
            console.log('[libhorizonBootstraper] [errorHandler] Rapport de plantage sauvegardé');
            client.destroy();
	        client.login(config.token);
        });
    })

function showLog() {
        if (config.keepLogs == true) {
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
        fs.appendFile(config.logPath, "\n" + time + " : " + loginfo, (error) => { /* handle error */ })
        }else{
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
}}

client.on('ready', () => {
    loginfo = "Connexion établie"
    showLog();
    if (config.testMode == false) {
      client.user.setActivity(config.gameActivity).catch(console.error);
      fs.writeFile("./config/mode.json", "{\n\"test\": false\n}")
    } else {
      client.user.setActivity("Horizon - Mode test").catch(console.error);
      testMode = true
      fs.writeFile("./config/mode.json", "{\n\"test\": true\n}")
    }
});

function requestRestart() {
	loginfo = "Une demande de redémarrage à été reçue. Le client va maintenant redémarrer..."
	showLog();
	process.exit(0);
}

function propName(prop, value) {
    for (var i in prop) {
        if (typeof prop[i] == 'object') {
            if (propName(prop[i], value)) {
                return res;
            }
        } else {
            if (prop[i] == value) {
                res = i;
                return res;
            }
        }
    }
    return undefined;
}

client.on('message', function (message) {
	if (message.guild) {
    if (message.content.startsWith(config.commandsPrefix + config.commandsSuffix + 'd')) {
        if (config.enableDebugInfo) {
		component = "debugInfo"
        if (message.author.username == "Minteck | ルカリオ" || message.author.username == "Horizon.Data") {
			message.delete()
			if (message.guild) { loginfo = "Distribution des informations de déboggage sur le salon #" + message.channel.name + " du serveur " + message.guild.name } else { loginfo = "Distribution des informations de déboggage par message privé à @" + message.author.tag }
			showLog();
			let system = os.type()
			let release = os.release()
			let cpuarch = os.arch()
			let freeram = os.freemem()
			let totalram = os.totalmem()
			var readablefreeram = Math.floor(freeram/1000000);
            var readabletotalram = Math.floor(totalram/1000000);
            var readabletookram = Math.floor(Math.floor(totalram - freeram)/1000000);
            var res = '';
			let computercpu = os.cpus
            //let cpumodel = os.cpus.model.toString
            computercpu.prototype.toString = function getCpuModel() {
                cpumodel = this.model;
                return ret;
            }
            process.memoryUsage.prototype.toString = function getProcessRam() {
                processram = this.heapUsed;
                return ret;
            }
            let readableprocessram = Math.floor(processram/1000000)
			message.channel.send("```\nMais dis donc, tu es un petit Riolu toi !\nVoici quelques informations de déboggage qui peuvent t'être utiles durant ton chemin !\n\n                       Version d'Horizon : 1.5\n                   Version de libhorizon : 0.1\n                         Serveur courant : main-shared\n                   Canal de mises à jour : nightly\n                 Temps de fonctionnement : " + client.uptime + "ms\n                                  Avatar : " + client.user.displayAvatarURL + "\n                                  Créé à : " + client.user.createdTimestamp + "\n                      Identifiant du bot : " + client.user.id + "\n          Identifiant du dernier message : " + client.user.lastMessageID + "\nServeurs sur lesquels le bot est présent : " + client.guilds.size + "\n                        Temps de latence : " + client.pings + "ms" + " (moy. " + client.ping + "ms)\n                    Identifiant du Shard : " + shard.id + "\n                  Plate-forme du serveur : " + system + "\n              Version de l'OS du serveur : " + release + "\n                 Architecture du serveur : " + cpuarch + "\n                            Mémoire vive : " + readabletookram + " Mio occupés (dont " + readableprocessram + " Mio alloués à Horizon) sur " + readabletotalram + " Mio (" + readablefreeram + " Mio libres)\n                   Processeur du serveur : " + cpumodel + "\n                          Nom du serveur : " + message.guild.name  + "\n          Chemin vers l'îcone du serveur : " + message.guild.iconURL + "\n                   Membres de ce serveur : " + message.guild.memberCount + "\n                 Propriétaire du serveur : " + message.guild.owner.displayName + "\n                       Région du serveur : " + message.guild.region + "\n               Niv. de vérif. du serveur : " + message.guild.verificationLevel + "\n              Acronyme du nom du serveur : " + message.guild.nameAcronym + "\n                 Salon d'absence (vocal) : " + message.guild.afkChannel.name + "\n   Tps. avant dépl. dans le salon d'abs. : " + message.guild.afkTimeout + " sec.\n```")
            }else{
				if (message.guild) { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.username + "#" + message.author.tag + " (" + message.author.id + ") depuis le serveur " + message.guild.name + " (#" + message.channel.name + ")" + " | " + message.content } else { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.tag + " (" + message.author.id + ") via messages privés | " + message.content }
				showLog();
            }
}
}}})

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

client.login(config.token);
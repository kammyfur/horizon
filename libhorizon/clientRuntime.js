var childProcess = require('child_process');
var config = require('../config/config.json')
var mode = require('../config/mode.json')
let testMode = false
let connected = false
let loginfo = "nothing"
let vocalChannel = null
var JsonDB = require('node-json-db');
var lang = new JsonDB("horigame/lang.json", true, true);
//const underscorelib = require('underscore');
const Discord = require('discord.js');
global.client = new Discord.Client();
const shard = new Discord.ShardClientUtil(client);
const fs = require('fs');
const os = require('os');
var cpumodel = ""
let processram
const talkedRecently = new Set();
let lstmsg

global.HorizonVer = "1.13.7"
global.LibhorizonVer = "1.0.1"
global.LibhorizonVerShort = LibhorizonVer
global.HorigameVer = "1.4.3"
global.SupportVer = "0.0.2"

let parsed0
let parsed1
let parsed2
let parsed3
let parsed4
let parsed5
let parsed6
let parsed7
let parsed8
let parsed9
let parsed10
let parsed11
let parsedop
var maintenance = false

const RawMessage = require('../features/rawMessage')
const TestMode = require('../features/testMode')
const RestartBot = require('../features/restartBot')
const SendLogs = require('../features/sendLogs')
const SendCrashes = require('../features/sendCrashes')
const SupportBot = require('../features/supportBot')
const EmbedExplain = require('../features/embedExplain')
const VoiceChannel = require('../features/voiceChannel')
//const Projectpedia = require('../features/projectpediaIntegration')
const Horigame = require('../horigame/source')

client.on('message', function (message) {
    if (maintenance === false) {
    let commandUsed = Horigame.parse(message,client.ping)
}});

client.on('message', function (message) {
    if (maintenance === true) {
        if (message.content.startsWith(config.commandsPrefix) || message.content.startsWith("pp") || message.content.startsWith("hg") || message.content.startsWith("memdmp") || message.content.startsWith("mtnmode")) {
            message.delete()
            message.channel.send("⚠️ J'ai bien compris votre commande `" + message.content + "`, **" + message.author.username + "**, mais malheureusement, je ne peux pas la traiter car je suis actuellement en maintenance")
        }
    }
})

client.on('message', function (message) {
    if (maintenance === false) {
    if (message.content.startsWith("mtnmode")) {
        if (message.author.id == config.masterAdminId) {
            maintenance = true;
            message.delete();
            client.user.setActivity("🚨 En maintenance")
            client.user.setStatus('dnd')
            message.author.send(":rotating_light: **Horizon** est maintenant en maintenance. Redémarrez le manuellement depuis le serveur pour le sortir de maintenance...")
    }}
}});

client.on('message', function (message) {
    SupportBot.check(message)
    if (maintenance === false) {
    if (message.content.startsWith(config.commandsPrefix)) {
    if (talkedRecently.has(message.author.id)) {
        message.channel.send(":warning: Et oh ! Vous allez trop vite ! Ralentissez un peu...");
    } else {
    let commandUsed = //Projectpedia.parse(message) ||
    RawMessage.parse(message) ||
    //TestMode.parse(message) ||
    RestartBot.parse(message) ||
    SendLogs.parse(message) ||
    SendCrashes.parse(message) ||
    EmbedExplain.parse(message,client) ||
    VoiceChannel.parse(message)// ||
    //Projectpedia.parse(message)
    talkedRecently.add(message.author.id);
    setTimeout(() => {
      talkedRecently.delete(message.author.id);
    }, 5000);
}
}}})

client.on('message', function (message) {
    if (maintenance === false) {
    if (config.enableChangeGameActivity) {
        if (message.content.startsWith(config.commandsPrefix + config.commandsSuffix + 'g')) {
            if (message.author.id == config.masterAdminId || message.author.id == config.slaveAdminId) {
				if (config.dynamicGameActivity == false) {
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
					message.author.send("Le message de jeu ne peut être modifié que si la propriété `dynamicGameActivity` est définie sur `true`. Demandez à mon administrateur de modifier cette propriété dans le fichier `config/config.json`")
			}}else{
                      if (message.guild) { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.username + "#" + message.author.tag + " (" + message.author.id + ") depuis le serveur " + message.guild.name + " (#" + message.channel.name + ")" + " | " + message.content } else { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.tag + " (" + message.author.id + ") via messages privés | " + message.content }
                      showLog();
                  }
      }

}}});

client.on('message', function (msg) {
    if (maintenance === false) {
	if (msg.guild !== null) {
	let HorizonDataId = "<@" + config.slaveAdminId + ">"
	let HorizonBotId = "<@" + client.user.id + ">"
	let text = msg.content
	if(text.indexOf(HorizonBotId) > -1) {
		members = msg.channel.members
		guildMember = msg.channel.members.find('id', config.slaveAdminId);
		loginfo = "Message privé envoyé :" + msg.content
		showLog();
		if (mode.test == false) {
		guildMember.send("**__" + msg.author + "__ a mentionné __Horizon__ sur le serveur __" + msg.guild.name + "__, dans le salon __" + msg.channel + "__. Le message était :**\n\n" + msg.content)
		}else{
			guildMember.send("**__" + msg.author + "__ a mentionné __Horizon__ sur le serveur __" + msg.guild.name + "__, dans le salon __" + msg.channel + "__. Le message était :**\n\n" + msg.content + "\n```\nCela a pris approximativement " + client.ping + "ms.\nDemandé par " + msg.author + ", et c'est un Mega-Lucario !```")
		}
}}}})

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
        var hour = date.getHours();
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
        console.log(time + " [" + shard.id + "] : " + loginfo)
        fs.appendFile(config.logPath, "\n" + time + " [" + shard.id + "] : " + loginfo, (error) => { /* handle error */ })
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
            console.log(time + " [" + shard.id + "] : " + loginfo)
}}

client.on('ready', (ready) => {
    global.HorizonAvatar = client.user.avatar
    loginfo = "Connexion établie"
    showLog();
    if (config.testMode == false) {
	  if (config.dynamicGameActivity == false) {
      client.user.setActivity(config.gameActivity).catch(console.error);
	  }else{
		  dga1();
	  }
      fs.writeFile("./config/mode.json", "{\n\"test\": false\n}", function () {
          return;
      })
    } else {
      client.user.setActivity("Horizon - Mode test").catch(console.error);
      testMode = true
      fs.writeFile("./config/mode.json", "{\n\"test\": true\n}", function () {
          return;
      })
    }
});

function dga1() {
    //client.user.setActivity("Bonjour !");
    if (maintenance === false) client.user.setPresence({ game: { name: "Bonjour !", details: "Découvrez Horizon..." }, status: 'online', "game.type": "STREAMING" })
	setTimeout(dga2, 10000);
}

function dga2() {
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
    var time = day + "/" + month + "/" + year;
    //client.user.setActivity(time);
    if (maintenance === false) client.user.setPresence({ game: { name: time, details: 'Nous sommes le ' + time }, status: 'online', "game.type": "WATCHING" })
	setTimeout(dga3, 10000);
}

function dga3() {
    //client.user.setActivity(HorizonVer + " - libhorizon " + LibhorizonVer);
    if (maintenance === false) client.user.setPresence({ game: { name: HorizonVer + '-' + LibhorizonVerShort + '-' + HorigameVer + '-' + SupportVer, details: 'Je suis en version ' + HorizonVer + ' !' }, status: 'online', "game.type": "LISTENING" })
	setTimeout(dga4, 10000);
}

function dga4() {
    //client.user.setActivity("Code : Minteck")
    if (maintenance === false) client.user.setPresence({ game: { name: 'Code : Minteck', details: 'Code écrit par Minteck' }, status: 'online', "game.type": "STREAMING" })
	setTimeout(dga5, 10000);
}

function dga5() {
    //client.user.setActivity("Idées : Horizon.Data")
    if (maintenance === false) client.user.setPresence({ game: { name: 'Idées : Horizon.Data', details: 'Idées données par Horizon.Data' }, status: 'online', "game.type": "STREAMING" })
	setTimeout(dga6, 10000);
}

function dga6() {
    //client.user.setActivity("#Plug²4Ever")
    if (maintenance === false) client.user.setPresence({ game: { name: '#PlugX4Ever', details: 'Je serai toujours sur ce serveur !' }, status: 'online', "game.type": "WATCHING"  })
	setTimeout(dga7, 10000);
}

function dga7() {
    //client.user.setActivity("hg init")
    if (maintenance === false) client.user.setPresence({ game: { name: 'Essayez \'=help\'', details: 'Commencez à jouer...' }, status: 'online', "game.type": "PLAYING" })
	setTimeout(dga1, 10000);
}

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
    if (maintenance === false) {
	if (message.guild) {
    if (message.content.startsWith(config.commandsPrefix + config.commandsSuffix + 'd')) {
        if (config.enableDebugInfo) {
		component = "debugInfo"
        if (message.author.id == config.masterAdminId || message.author.id == config.slaveAdminId) {
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
            const processram = process.memoryUsage().heapUsed / 1024 / 1024;
            const readableprocessram = Math.round(processram*100)/100
			message.channel.send("```\nMais dis donc, tu es un petit Riolu toi !\nVoici quelques informations de déboggage qui peuvent t'être utiles durant ton chemin !\n\n                       Version d'Horizon : " + HorizonVer +"\n                   Version de libhorizon : " + LibhorizonVer + "\n                         Serveur courant : main-shared\n                   Canal de mises à jour : nightly\n                 Temps de fonctionnement : " + client.uptime + "ms\n                                  Avatar : " + client.user.displayAvatarURL + "\n                                  Créé à : " + client.user.createdTimestamp + "\n                      Identifiant du bot : " + client.user.id + "\n          Identifiant du dernier message : " + client.user.lastMessageID + "\nServeurs sur lesquels le bot est présent : " + client.guilds.size + "\n                        Temps de latence : " + client.pings + "ms" + " (moy. " + client.ping + "ms)\n                    Identifiant du Shard : " + shard.id + "\n                  Plate-forme du serveur : " + system + "\n              Version de l'OS du serveur : " + release + "\n                 Architecture du serveur : " + cpuarch + "\n                            Mémoire vive : " + readabletookram + " Mio occupés (dont " + readableprocessram + " Mio alloués à Horizon) sur " + readabletotalram + " Mio (" + readablefreeram + " Mio libres)\n                          Nom du serveur : " + message.guild.name  + "\n          Chemin vers l'îcone du serveur : " + message.guild.iconURL + "\n                   Membres de ce serveur : " + message.guild.memberCount + "\n                 Propriétaire du serveur : " + message.guild.owner.displayName + "\n                       Région du serveur : " + message.guild.region + "\n               Niv. de vérif. du serveur : " + message.guild.verificationLevel + "\n              Acronyme du nom du serveur : " + message.guild.nameAcronym + "\n   Tps. avant dépl. dans le salon d'abs. : " + message.guild.afkTimeout + " sec.\n```")
            }else{
				if (message.guild) { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.username + "#" + message.author.tag + " (" + message.author.id + ") depuis le serveur " + message.guild.name + " (#" + message.channel.name + ")" + " | " + message.content } else { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.tag + " (" + message.author.id + ") via messages privés | " + message.content }
				showLog();
            }
}
}}}})

client.on('message', function (message) {
    if (maintenance === false) {
	if (message.guild) {
    if (message.content.startsWith('memdmp')) {
        if (message.guild) {
        if (message.author.id == config.masterAdminId) {
			let system = os.type()
			let release = os.release()
			let cpuarch = os.arch()
			let freeram = os.freemem()
			let totalram = os.totalmem()
			var readablefreeram = Math.floor(freeram/1000000);
            var readabletotalram = Math.floor(totalram/1000000);
            var tookram = totalram - freeram;
            var readabletookram = Math.floor(Math.floor(totalram - freeram)/1000000);
            var res = '';
			let computercpu = os.cpus
            const processram = process.memoryUsage().heapUsed / 1024 / 1024;
            const readableprocessram = Math.round(processram*100)/100
			message.channel.send("```Memory Dump - RAM ID : 0 | Server ID : 0 | Shard ID : " + shard.id + "\n000000001     (int)     " + os.freemem + "\n000000002     (int)     " + os.totalmem + "\n000000003     (int)     " + tookram + "\n000000004     (str)     " + release + "\n000000005     (str)     " + cpuarch + "\n000000006     (int)     " + client.user.createdTimestamp + "\n000000007     (int)     " + client.user.id + "\n000000008     (int)     " + client.guilds.size + "\n000000009     (int)     " + client.uptime + "\n00000000A     (str)     " + message.guild.region + "\n00000000B     (int)     " + message.author.id + "\n00000000C     (int)     " + message.guild.owner.id + "\n00000000D     (str)     " + message.guild.owner.tag + "\n00000000E     (int)     " + message.guild.afkTimeout + "\n00000000F     (str)     " + HorizonVer + "\n000000011     (str)     " + LibhorizonVer + "\n000000012     (int)     " + client.ping + "\n000000013     (str)     " + os.platform + "\n000000014     (int)     " + message.guild.memberCount + "\n000000015     (int)     " + message.guild.afkChannelID + "\n000000016     (int)     " + message.guild.id + "\n000000017     (int)     " + client.user.lastMessageID + "\n000000018     (str)     " + client.user.presence.game.name + "\n000000019     (str)     " + client.user.presence.status + "\n00000001A     (str)     " + config.logPath + "\n00000001B     (str)     " + config.commandsPrefix + config.commandsSuffix + "\n00000001C     (boo)     " + config.dynamicGameActivity + "\n00000001D     (boo)     " + config.enableHorigame + "\n00000001E     (int)     " + config.pionnerRoleID + "```")
            }else{
				message.channel.send("```Only System Administrator can get Memory Dump info```")
            }
}}}}})

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
    loginfo = "Erreur inconnue : " + err.toString()
    showLog();
});

client.login(config.token);

function speakEnglish(member) {
    var returning
    try {
        var langconf = lang.getData(member.id)
    } catch(err) {
        var langconf = 'fr'
    }
    if (langconf == 'en') { returning = true } else { returning = false }
    return returning;
}
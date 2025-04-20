//  _   _            _
// | | | | ___  _ __(_)_______  _ __
// | |_| |/ _ \| '__| |_  / _ \| '_ \
// |  _  | (_) | |  | |/ / (_) | | | |
// |_| |_|\___/|_|  |_/___\___/|_| |_|
//
// Créé par Horizon et Minteck
// Copyright (c) 2019, Horizon
//
// Horizon est distribué sous licence Minteck Projects PLA 1.0.
// Pour en savoir plus, vous pouvez accéder à ce site Internet :
//    http://projectpedia.referata.com/wiki/Licence:Minteck_Projects_PLA

const Discord = require('discord.js');
const client = new Discord.Client();
let testMode = false

client.on('ready', () => {
  console.log('Le bot à bien été connecté à Discord.');
  if (client.username == "Horizon") {
    client.user.setActivity("Forza Horizon 4").catch(console.error);
    testMode = false
  } else {
    client.user.setActivity("Horizon - Mode test").catch(console.error);
    testMode = true
  }
});

client.on('message', msg => {
  if (msg.content.startsWith('> ')) {
	  if (message.author.username == "Minteck | ルカリオ" || message.author.username == "Horizon.Data") {
                let args = msg.content.split(' ');
                args.shift();
                msg.delete();
                let text = args.join(' ')
		if (testMode == false) {
		    msg.channel.send(text).catch();
		  } else {
		    msg.channel.send(text + "\n```\nCela a pris approximativement " + client.ping + "ms.\nDemandé par " + msg.author + ", et c'est un Mega-Lucario !```").catch();
		  }
                console.log('Message : ' + text);
				}else{
				message.channel.send("```\n403: Accès refusé\n```")
                console.log("Accès refusé");
            }
    }
});

client.on('message', function (message) {
    if (message.content == '><') {
        if (message.author.username == "Minteck | ルカリオ" || message.author.username == "Horizon.Data") {
			if (testMode == true) {
				message.delete()
                message.channel.send("```\nMode de test désactivé\n```").catch();
                console.log("Mode test désactivé");
				testMode = false
				client.user.setActivity("Forza Horizon 4");
			}else{
				message.delete()
				message.channel.send("```\nMode de test activé\n```" + "\n```\nCela a pris approximativement " + client.ping + "ms.\nDemandé par " + message.author + ", et c'est un Mega-Lucario !```").catch();
                console.log("Mode test activé");
				testMode = true
				client.user.setActivity("Horizon - Mode test");
			}
            }else{
				message.channel.send("```\n403: Accès refusé\n```")
                console.log("Accès refusé");
            }
    }
});

client.on('message', function (message) {
    if (message.content.startsWith('><d')) {
        if (message.author.username == "Minteck | ルカリオ" || message.author.username == "Horizon.Data") {
			message.delete()
			message.channel.send("```\nMais dis donc, tu es un petit Riolu toi !\nVoici quelques informations de déboggage qui peuvent t'être utile durant ton chemin !\n\nAvatar : " + client.user.displayAvatarURL + "\nCréé à : " + client.user.createdTimestamp + "\nIdentifiant du bot : " + client.user.id + "\nIdentifiant du dernier message : " + client.user.lastMessageID + "\n```")
            }else{
				message.channel.send("```\n403: Accès refusé\n```")
                console.log("Accès refusé");
            }
}})

client.login("InsérerLeTokenIci");

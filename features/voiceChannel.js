const Discord = require('discord.js')
const client = new Discord.Client()
const Command = require('../libhorizon/commandRt')
let loginfo = "nothing"
var config = require('../config/config.json')
const fs = require('fs');
const os = require('os');
const shard = new Discord.ShardClientUtil(client);
const mode = require('../config/mode.json')
let connected = false
let vocalChannel

module.exports = class GameActivity extends Command {

    static match(message) {
        if (config.enableVoiceChannel) {
            if (message.guild) {
                if (message.content.startsWith(config.commandsPrefix + config.commandsSuffix + 'md')) {
                    if (message.author.username == "Minteck | ルカリオ" || message.author.username == "Horizon.Data") {
                        message.delete()
                        loginfo = "Distribution des informations de déboggage de l'audio sur le salon #" + message.channel.name + " du serveur " + message.guild.name
                        showLog();
                        if (connected == true) {
                        message.channel.send("```\nInformations de déboggage de la musique pour ce petit Gardevoir qui me les a demandées :\n\n" + "               Connexion vocale : " + true + "\n\nInformations du salon vocal :" + "\n                 Salon courrant : " + vocalChannel.name + "\n                  Salon complet : " + vocalChannel.full + "\n           Débit du salon vocal : " + vocalChannel.bitrate + " kbps\n       Catégorie du salon vocal : " + vocalChannel.parent.name + " (" + voiceChannel.parentID + ")\n Limite d'utilisateurs du salon : " + vocalChannel.position + "\n      Peut parler dans le salon : " + vocalChannel.speakable + "\n\nInformations sur la connexion au salon :" + "\n        Horizon transmet du son : " + vocalChannel.speaking + "\n           État de la connexion : " + vocalChannel.connection.status + "\n\nInformations concernant la transmission audio sortante :" + "\n                   (actuellement indisponible)\n```")
                        }else{
                            message.channel.send("```\nInformations de déboggage de la musique pour ce petit Gardevoir qui me les a demandées :\n\n" + "               Connexion vocale : " + "false\n```")
                        }}else{
                            if (message.guild) { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.username + "#" + message.author.tag + " (" + message.author.id + ") depuis le serveur " + message.guild.name + " (#" + message.channel.name + ")" + " | " + message.content } else { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.tag + " (" + message.author.id + ") via messages privés | " + message.content };
                            showLog();
                        }
            }
            if (message.content === config.commandsPrefix + config.commandsSuffix + 'mj') {
                if (message.author.username == "Minteck | ルカリオ" || message.author.username == "Horizon.Data") {
                    message.delete()
              if (message.member.voiceChannel) {
                  if (connected == true) {
                    message.author.send(":no_entry: Je suis déjà connecté au salon vocal **`" + vocalChannel.name + '`**. Utilisez `' + config.commandsPrefix + config.commandsSuffix + 'ml` pour le quitter...');
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
                          if (message.guild) { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.tag + " (" + message.author.id + ") depuis le serveur " + message.guild.name + " (#" + message.channel.name + ")" + " | " + message.content } else { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.tag + " (" + message.author.id + ") via messages privés | " + message.content }
                          showLog();
                      }}
                      if (message.content === config.commandsPrefix + config.commandsSuffix + 'ml') {
                        if (message.author.username == "Minteck | ルカリオ" || message.author.username == "Horizon.Data") {
                            message.delete()
                      if (connected == true) {
                            message.author.send(":white_check_mark: J'ai quitté le salon vocal **`" + vocalChannel.name + '`**...');
                          vocalChannel.leave()
                          connected = false
                          loginfo = "Déconnecté du salon vocal"
                          showLog();
                      } else {
                        message.author.send(":no_entry: **Horizon** n'est pas encore connecté à un salon vocal. Utilisez la commande `" + config.commandsPrefix + config.commandsSuffix + 'mj` pour en rejoindre un...');
                      }
                    }else{
                                  if (message.guild) { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.username + "#" + message.author.tag + " (" + message.author.id + ") depuis le serveur " + message.guild.name + " (#" + message.channel.name + ")" + " | " + message.content } else { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.tag + " (" + message.author.id + ") via messages privés | " + message.content }
                                  showLog();
                              }}
        }

}}

}

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
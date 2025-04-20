const Discord = require('discord.js')
const client = new Discord.Client()
const Command = require('../libhorizon/commandRt')
let loginfo = "nothing"
var config = require('../config/config.json')
const fs = require('fs');
const os = require('os');
const shard = new Discord.ShardClientUtil(client);
const mode = require('../config/mode.json')

module.exports = class SendLogs extends Command {

    static match(message) {
            if (message.content == config.commandsPrefix + config.commandsSuffix + 'l') {
                if (config.keepLogs) {
                message.delete()
                if (message.author.username == "Minteck | ルカリオ" || message.author.username == "Horizon.Data") {
                    const reports = new Discord.Attachment(config.logPath)
                    loginfo = "Fichier journal envoyé à @" + message.author.tag
                    showLog();
                    if (mode.test == false) {
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
            }else{
                if (message.author.username == "Minteck | ルカリオ" || message.author.username == "Horizon.Data") {
                message.delete()
                message.author.send("Désolé, mais mon administrateur m'a interdit de sauvegarder une copie des fichiers journaux...")
                loginfo = "Rejet d'envoi des fichiers jounaux"
                showLog();
            }

}}}}

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
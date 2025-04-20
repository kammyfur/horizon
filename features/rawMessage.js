const Discord = require('discord.js')
const client = new Discord.Client()
const Command = require('../libhorizon/commandRt')
let loginfo = "nothing"
var config = require('../config/config.json')
const fs = require('fs');
const os = require('os');
const shard = new Discord.ShardClientUtil(client);
const mode = require('../config/mode.json');

module.exports = class RawMessage extends Command {

    static match(message) {
        if (config.enableRawMessages) {
        if (message.content.startsWith(config.commandsPrefix + ' ')) {
            if (message.author.id == "294910706250285056" || message.author.username == "Horizon.Data") {
                      let args = message.content.split(' ');
                      args.shift();
                      message.delete();
                      let text = args.join(' ')
              if (mode.test == false) {
                  message.channel.send(text).catch();
                } else {
                  message.channel.send(text + "\n```\nCela a pris approximativement " + client.ping + "ms.\nDemandé par " + message.author + ", et c'est un Mega-Lucario !```").catch();
                }
                      if (message.guild) {
                      loginfo = "Message envoyé sur le salon #" + message.channel.name + " sur le serveur " + message.guild.name + " : " + text
                      showLog();
                      } else {
                      loginfo = "Message envoyé via DM à l'utilisateur @" + message.author.tag + " : " + message.content
                      showLog();
        }}else{
                      if (message.guild) { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.username + "#" + message.author.tag + " (" + message.author.id + ") depuis le serveur " + message.guild.name + " (#" + message.channel.name + ")" + " | " + message.content } else { loginfo = "Rejet d'accès à l'utilisateur @" + message.author.tag + " (" + message.author.id + ") via messages privés | " + message.content }
                      showLog();
                  }
      }

}}}

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
const Discord = require('discord.js')
const client = new Discord.Client()
const Command = require('../libhorizon/commandRt')
let loginfo = "nothing"
var config = require('../config/config.json')
const fs = require('fs');
const os = require('os');
const shard = new Discord.ShardClientUtil(client);
const mode = require('../config/mode.json')

module.exports = class TestMode extends Command {

    static match(message) {
        if (config.enableTestMode) {
        if (message.content == config.commandsPrefix + config.commandsSuffix) {
            if (message.author.username == "Minteck | ルカリオ" || message.author.username == "Horizon.Data") {
                if (mode.test == true) {
                    message.delete()
                    message.channel.send("```\nMode de test désactivé\n```").catch();
                    loginfo = "Mode test désactivé"
                    showLog();
                    fs.writeFile("./config/mode.json", "{\n\"test\": false\n}")
                    client.user.setActivity(config.gameActivity);
                }else{
                    message.delete()
                    message.channel.send("```\nMode de test activé\n```" + "\n```\nCela a pris approximativement " + client.ping + "ms.\nDemandé par " + message.author + ", et c'est un Méga-Lucario !```").catch();
                    loginfo = "Mode test activé"
                    showLog();
                    fs.writeFile("./config/mode.json", "{\n\"test\": true\n}")
                    testMode = true
                    client.user.setActivity("Horizon - Mode test");
                }}

}}

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
}}}}
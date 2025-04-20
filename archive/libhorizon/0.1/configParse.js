// libhorizon, librairie de base pour le fonctionnement de Horizon
// configParse permet de charger la configuration et de la valider
//
// Si vous venez à modifier le code de Horizon, veuillez ne pas modifier cette section.
// Toute modification pourrait entraîner des dysfonctionnements...
var fs = require('fs');

if (fs.existsSync('./config/config.json')) {
    var config = require('../config/config.json');
}else{
    console.log("Impossible de charger la configuration\n\nLa configuration de Horizon n'a pas pu être chargée car le fichier est innexistant ou innaccessible.\nVérifiez qu'il est bien situé dans le dossier 'config' et que vous avez la permission d'y accéder.")
    process.exit(2)
}

let confInfo = ""
let confLine = 0

function invalidConfig() {
    console.log("\nConfiguration (config/config.json) invalide :\n\n" + confInfo + "\n    à la ligne " + confLine)
    process.exit(1)
}

if ( config.testMode != false && config.testMode != true ) {
    confInfo = "La propriété 'testMode' n'est pas une valeur booléenne.";
    confLine = 5
    invalidConfig();
}

if ( config.keepLogs != false && config.keepLogs != true ) {
    confInfo = "La propriété 'keepLogs' n'est pas une valeur booléenne.";
    confLine = 6
    invalidConfig();
}

if ( config.saveCrashes != false && config.saveCrashes != true ) {
    confInfo = "La propriété 'saveCrashes' n'est pas une valeur booléenne.";
    confLine = 7
    invalidConfig();
}

if ( config.commandsPrefix.length > 1 ) {
    confInfo = "La propriété 'commandsPrefix' est plus longue que 1 caractère (commandsPrefix.length > 1)";
    confLine = 10
    invalidConfig();
}

if ( config.commandsSuffix.length > 1 ) {
    confInfo = "La propriété 'commandsSuffix' est plus longue que 1 caractère (commandsSuffix.length > 1)";
    confLine = 11
    invalidConfig();
}

if ( config.enableVoiceChannel != false && config.enableVoiceChannel != true ) {
    confInfo = "La propriété 'enableVoiceChannel' n'est pas une valeur booléenne.";
    confLine = 16
    invalidConfig();
}

if ( config.enableChangeGameActivity != false && config.enableChangeGameActivity != true ) {
    confInfo = "La propriété 'enableChangeGameActivity' n'est pas une valeur booléenne.";
    confLine = 17
    invalidConfig();
}

if ( config.enableRawMessages != false && config.enableRawMessages != true ) {
    confInfo = "La propriété 'enableRawMessages' n'est pas une valeur booléenne.";
    confLine = 18
    invalidConfig();
}

if ( config.enableActionCancel != false && config.enableActionCancel != true ) {
    confInfo = "La propriété 'enableActionCancel' n'est pas une valeur booléenne.";
    confLine = 19
    invalidConfig();
}

if ( config.enableRestartCmd != false && config.enableRestartCmd != true ) {
    confInfo = "La propriété 'enableRestartCmd' n'est pas une valeur booléenne.";
    confLine = 20
    invalidConfig();
}

if ( config.enableTestMode != false && config.enableTestMode != true ) {
    confInfo = "La propriété 'enableTestMode' n'est pas une valeur booléenne.";
    confLine = 21
    invalidConfig();
}

if ( config.enableDebugInfo != false && config.enableDebugInfo != true ) {
    confInfo = "La propriété 'enableDebugInfo' n'est pas une valeur booléenne.";
    confLine = 22
    invalidConfig();
}

if ( config.enableVoiceDebugInfo != false && config.enableVoiceDebugInfo != true ) {
    confInfo = "La propriété 'enableVoiceDebugInfo' n'est pas une valeur booléenne.";
    confLine = 23
    invalidConfig();
}

console.log("Configuration OK : 17 propriétés chargées")
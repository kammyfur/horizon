//
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

//const underscorelib = require('underscore');
process.env.GOOGLE_APPLICATION_CREDENTIALS = __dirname + "/config/SupportMinteckProjects-36876da72343.json"
const Discord = require('discord.js');
const os = require('os');
const fs = require('fs');
var childProcess = require('child_process');

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

runScript('./libhorizon/configParse.js', function (err) {
    if (err) throw err;
	console.log('[libhorizonBootstraper] [configParse] La configuration à été initialisée correctement...');
	runScript('./libhorizon/shardUtilManager.js', function (err) {
		if (err) throw err;
		console.log("[libhorizonBootstraper] [clientRuntime] Le client d'est arrêté");
    });
});

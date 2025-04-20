var config = require('../config/config.json')
const os = require('os');
const fs = require('fs');
let eemsgid = 0

	let system = os.type()
	let release = os.release()
	let cpuarch = os.arch()
	let freeram = os.freemem()
	let totalram = os.totalmem()
	var readablefreeram = Math.floor(freeram/1000000);
	var readabletotalram = Math.floor(totalram/1000000);
	let cpu = os.cpus
	let cpumodel = cpu.model
	eemsgid = getRandomInt(9)
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
    let uptime = process.uptime();
    if (config.saveCrashes = true) {
	fs.appendFile(config.crashRpPath, "Unexpected Error Occured\n\non process " + process.ppid + ", nodejs " + process.version + "\n\n                       Version d'Horizon : 1.5\n                         Serveur courant : main-shared\n                   Canal de mises à jour : nightly\n                 Temps de fonctionnement : " + uptime + "ms\n                  Plate-forme du serveur : " + system + "\n              Version de l'OS du serveur : " + release + "\n                 Architecture du serveur : " + cpuarch + "\n                            Mémoire vive : " + readablefreeram + " Mio libres sur " + readabletotalram + " Mio\n                   Processeur du serveur : " + cpumodel + "\n\n-----------------------------------------\n\n", function (err) {
		if (err) throw err;
		console.log("[libhorizonBootstraper] [errorHandler] Rapport de plantage sauvegardé sous le nom \"" + config.crashRpPath + "\".");
    })}else{
        console.log("[libhorizonBootstraper] [errorHandler] Plantage capturé mais non sauvegardée car saveCrashes = " + config.saveCrashes + " dans config.json:7")
    };
    
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
      }
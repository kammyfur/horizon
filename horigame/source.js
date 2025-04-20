const Discord = require('discord.js')
const client = new Discord.Client()
let loginfo = "nothing"
var config = require('../config/config.json')
const fs = require('fs');
const os = require('os');
const shard = new Discord.ShardClientUtil(client);
const mode = require('../config/mode.json')
var JsonDB = require('node-json-db');
var db = new JsonDB("horigame/db.json", true, true);
var uconf = new JsonDB("horigame/usersettings.json", true, true);
let lstmsg
const talkedRecently = new Set();
const xpCooldown = new Set();
const translate = require('@vitalets/google-translate-api');
let editmsg
let lstmsgpx
global.text = ""

module.exports.parse = function (message,ping) {
        if (config.enableHorigame) {
            if (message.guild) {
                if (message.content.startsWith("hg ")) {
                    if (speakEnglish(message.author)) {
                        message.channel.send({embed: {
                            color: 0xffcc00,
                            description: "Since Horizon 1.13, the prefix is now `=` and not `hg`.",
                            footer: {
                                text: "This notice will be removed on Horizon 1.15 - Horizon " + HorizonVer + " - " + message.author.username
                            }
                        }})
                    } else {
                        message.channel.send({embed: {
                            color: 0xffcc00,
                            description: "Depuis Horizon 1.13, le préfixe est maintenant `=` et non `hg`.",
                            footer: {
                                text: "Ce message sera retiré dans Horizon 1.15 - Horizon " + HorizonVer + " - " + message.author.username
                            }
                        }})
                    }
                }
            if (message.content.startsWith("=")) {
                if (talkedRecently.has(message.author.id)) {
                    lstmsg = message
                    blockMessage();
                } else {
                talkedRecently.add(message.author.id);
                setTimeout(() => {
                talkedRecently.delete(message.author.id);
                }, 5000);
            if (message.content == '=init') {
                try {
                    var data = db.getData("/game/" + message.author.id);
                } catch(error) {
                    lstmsg = message
                    initUser();
                };
                if (data) {
                    // if (speakEnglish(message.author)) { message.channel.send(":no_entry: **" + message.author.username + "**'s profile already exists. Use `=reset` to reset it") } else { message.channel.send(":no_entry: Le profil utilisateur de **" + message.author.username + "** existe déjà. Utilisez `=reset` pour le réinitialiser") }
                    if (speakEnglish(message.author)) { message.channel.send({embed: {
                        color: 0xff0000,
                        author: {
                            name: "Horigame"
                        },
                        title: "Error",
                        description: ":no_entry: Your profile already exists, use `=reset` to reset it.",
                        footer: {
                            text: "Version " + HorizonVer + " - " + message.author.username
                        }
                    }}) } else { message.channel.send({embed: {
                        color: 0xff0000,
                        author: {
                            name: "Horigame"
                        },
                        title: "Erreur",
                        description: ":no_entry: Votre profil existe déjà, utilisez `=reset` pour le réinitialiser.",
                        footer: {
                            text: "Version " + HorizonVer + " - " + message.author.username
                        }
                    }}) }
            }}else{
                if (message.content == '=stats') {
                    try {
                        var data = db.getData("/game/" + message.author.id);
                    } catch(error) {
                        lstmsg = message
                        initErr();
                    };
                    if (data) {
                    var level = db.getData("/game/" + message.author.id + "/level")
                    var xp = db.getData("/game/" + message.author.id + "/xp")
                    var diamonds = db.getData("/game/" + message.author.id + "/objects/diamonds")
                    var golds = db.getData("/game/" + message.author.id + "/objects/golds")
                    var irons = db.getData("/game/" + message.author.id + "/objects/irons")
                    var woods = db.getData("/game/" + message.author.id + "/objects/woods")
                    var xpBottle = db.getData("/game/" + message.author.id + "/bonus/xpBottle")
                    var goldPack = db.getData("/game/" + message.author.id + "/bonus/goldPack")
                    var ironPack = db.getData("/game/" + message.author.id + "/bonus/ironPack")
                    var woodPack = db.getData("/game/" + message.author.id + "/bonus/woodPack")
                    var totalXp = xp + ( level * 500 )
                    var admin = false;
                    try {
                        admin = db.getData("/game/" + message.author.id + "/admin");
                    } catch(error) {};
                    if (admin === true) { if (speakEnglish(message.author)) { var adminMsg = "\n\n:watch: **__Out__, you're an Horigame administrator!**" } else { var adminMsg = "\n\n:watch: **__Attention__, vous êtes un administrateur de Horigame !**" } } else { var adminMsg = "" }
                    // if (speakEnglish(message.author)) { message.channel.send(":open_hands: **Hi " + message.author.username + ", here are your statictics:**"  + adminMsg +"\n\n:arrow_upper_right: **Level**: " + level + "\n:level_slider: **XP points for current level**: " + xp + "/500\n:up: **Total XP points**: " + totalXp + "\n:large_blue_diamond: **Diamonds in inventory**: " + diamonds + "\n:large_orange_diamond: **Gold nuggets in inventory**: " + golds + "\n:flag_white: **Iron ingots in inventory**: " + irons + "\n:pick:  **Wooden planks in inventory**: " + woods + "\n:milk: **Awaiting *XP* packages**: " + xpBottle + "\n:package: **Awaiting *wooden planks* packages**: " + woodPack + "\n:package: **Awaiting *iron ingots* packages**: " + ironPack + "\n:package: **Awaiting *gold nuggets* packages**: " + goldPack) } else { message.channel.send(":open_hands: **Bonjour " + message.author.username + ", voici vos statistiques :**"  + adminMsg +"\n\n:arrow_upper_right: **Niveau** : " + level + "\n:level_slider: **Points d'expérience pour ce niveau** : " + xp + "/500\n:up: **Total des points d'expérience** : " + totalXp + "\n:large_blue_diamond: **Diamants dans l'inventaire** : " + diamonds + "\n:large_orange_diamond: **Pépites d'or dans l'inventaire** : " + golds + "\n:flag_white: **Lingots de fer dans l'inventaire** : " + irons + "\n:pick:  **Planches de bois dans l'inventaire** : " + woods + "\n:milk: **Fioles d'expérience dans l'inventaire Bonus** : " + xpBottle + "\n:package: **Packs de *bois* dans l'inventaire Bonus** : " + woodPack + "\n:package: **Packs de *fer* dans l'inventaire Bonus** : " + ironPack + "\n:package: **Packs d'*or* dans l'inventaire Bonus** : " + goldPack) }
                    if (speakEnglish(message.author)) { message.channel.send({embed: {
                        // color: 0x33cc33,
                        author: {
                            name: "Horigame"
                        },
                        title: "Stats",
                        description: "Hello " + message.author + ", welcome at home!" + adminMsg,
                        fields: [{
                            name: "Level",
                            value: level
                        },
                        {
                            name: "XP points for current level",
                            value: xp
                        },
                        {
                            name: "Total XP points",
                            value: totalXp
                        },
                        {
                            name: "Diamonds in inventory",
                            value: diamonds
                        },
                        {
                            name: "Gold nuggets in inventory",
                            value: golds
                        },
                        {
                            name: "Iron ingots in inventory",
                            value: irons
                        },
                        {
                            name: "Wooden planks in inventory",
                            value: woods
                        },
                        {
                            name: "Awaiting XP packages",
                            value: xpBottle
                        },
                        {
                            name: "Awaiting wooden planks packages",
                            value: woodPack
                        },
                        {
                            name: "Awaiting iron ingots packages",
                            value: ironPack
                        },
                        {
                            name: "Awaiting gold nuggets packages",
                            value: goldPack
                        }],
                        footer: {
                            text: "Version " + HorizonVer + " - " + message.author.username
                        }
                    }}) } else { message.channel.send({embed: {
                        // color: 0x33cc33,
                        author: {
                            name: "Horigame"
                        },
                        title: "Statistiques",
                        description: "Coucou " + message.author + ", bienvenue chez vous !" + adminMsg,
                        fields: [{
                            name: "Niveau actuel",
                            value: level
                        },
                        {
                            name: "Expérience dans le niveau actuel",
                            value: xp
                        },
                        {
                            name: "Points d'expérience depuis le début",
                            value: totalXp
                        },
                        {
                            name: "Diamonds in inventory",
                            value: diamonds
                        },
                        {
                            name: "Pépites d'or dans l'inventaire",
                            value: golds
                        },
                        {
                            name: "Lingots de fer dans l'inventaire",
                            value: irons
                        },
                        {
                            name: "Planches de bois dans l'inventaire",
                            value: woods
                        },
                        {
                            name: "Paquets d'expérience en attente",
                            value: xpBottle
                        },
                        {
                            name: "Paquets de planches de bois en attente",
                            value: woodPack
                        },
                        {
                            name: "Paquets de lingots de fer en attente",
                            value: ironPack
                        },
                        {
                            name: "Paquets de pépites d'or en attente",
                            value: goldPack
                        }],
                        footer: {
                            text: "Version " + HorizonVer + " - " + message.author.username
                        }
                    }}) }
                }}else{
                    if (message.content == '=reset') {
                        try {
                            var data = db.getData("/game/" + message.author.id);
                        } catch(error) {
                            lstmsg = message
                            initErr();
                        };
                        // if (speakEnglish(message.author)) { message.channel.send(":warning: You are going to reset **" + message.author.username + "**'s user profile. This cannot __cannot be undone__. **__BE SURE OF WHAT YOU'RE DOING !!!__**. Pour continuer tout de même, envoyez `=reset --yes-i-know-what-im-doing`") } else { message.channel.send(":warning: Vous vous apprêtez à réinitialiser le profil utilisateur de **" + message.author.username + "**. Cette action est __irréversible__. **__SOYEZ BIEN SUR DE CE QUE VOUS FAITES !!!__**. Pour continuer tout de même, envoyez `=reset --yes-i-know-what-im-doing`") }
                        if (speakEnglish(message.author)) { message.channel.send({embed: {
                            color: 0xffcc00,
                            author: {
                                name: "Horigame"
                            },
                            title: ":warning: Warning!",
                            description: "Resetting your profile to factory settings is a **dangerous** thing, and **__cannot be undone__**.\n\nEnter the `=reset --yes-i-know-what-im-doing` command to continue.",
                            footer: {
                                text: "Version " + HorizonVer + " - " + message.author.username
                            }
                        }}) } else { message.channel.send({embed: {
                            color: 0xffcc00,
                            author: {
                                name: "Horigame"
                            },
                            title: ":warning: Avertissement !",
                            description: "Réinitialiser votre profil aux réglages d'usine est une action **dangeureuse**, qui est **irréversible**.\n\nEntrez la commande `=reset --yes-i-know-what-im-doing` pour continuer.",
                            footer: {
                                text: "Version " + HorizonVer + " - " + message.author.username
                            }
                        }}) }
                    }else{
            if (message.content == '=reset --yes-i-know-what-im-doing') {
                try {
                    var data = db.getData("/game/" + message.author.id);
                } catch(error) {
                    lstmsg = message
                    initErr();
                };
                if (speakEnglish(message.author)) { message.channel.send({embed: {
                    color: 0x33cc33,
                    author: {
                        name: "Horigame"
                    },
                    title: "Doing things",
                    description: ":clock: Your profile is being reset, please wait...",
                    footer: {
                        text: "Version " + HorizonVer + " - " + message.author.username
                    }
                }}).then((message) => {
                    db.push("/game/" + message.author.id + "/level", 0);
                db.push("/game/" + message.author.id + "/xp", 20);
                db.push("/game/" + message.author.id + "/objects/diamonds", 0);
                db.push("/game/" + message.author.id + "/objects/irons", 0);
                db.push("/game/" + message.author.id + "/objects/golds", 0);
                db.push("/game/" + message.author.id + "/objects/woods", 5);
                db.push("/game/" + message.author.id + "/bonus/xpBottle", 0);
                db.push("/game/" + message.author.id + "/bonus/ironPack", 0);
                db.push("/game/" + message.author.id + "/bonus/goldPack", 0);
                db.push("/game/" + message.author.id + "/bonus/woodPack", 0);
                message.edit({embed: {
                    color: 0x33cc33,
                    author: {
                        name: "Horigame"
                    },
                    title: "Success",
                    description: ":file_cabinet: Your profile has been reset to factory defaults!",
                    footer: {
                        text: "Version " + HorizonVer + " - " + message.author.username
                    }
                }})
                }) } else { message.channel.send({embed: {
                    color: 0x33cc33,
                    author: {
                        name: "Horigame"
                    },
                    title: "Traitement en cours",
                    description: ":clock: Votre profil est en cours de réinitialisation, merci de patienter...",
                    footer: {
                        text: "Version " + HorizonVer + " - " + message.author.username
                    }
                }}).then((message) => {
                    db.push("/game/" + message.author.id + "/level", 0);
                db.push("/game/" + message.author.id + "/xp", 20);
                db.push("/game/" + message.author.id + "/objects/diamonds", 0);
                db.push("/game/" + message.author.id + "/objects/irons", 0);
                db.push("/game/" + message.author.id + "/objects/golds", 0);
                db.push("/game/" + message.author.id + "/objects/woods", 5);
                db.push("/game/" + message.author.id + "/bonus/xpBottle", 0);
                db.push("/game/" + message.author.id + "/bonus/ironPack", 0);
                db.push("/game/" + message.author.id + "/bonus/goldPack", 0);
                db.push("/game/" + message.author.id + "/bonus/woodPack", 0);
                message.edit({embed: {
                    color: 0x33cc33,
                    author: {
                        name: "Horigame"
                    },
                    title: "Succès",
                    description: ":file_cabinet: Votre profil à bien été restauré aux valeurs d'usine !",
                    footer: {
                        text: "Version " + HorizonVer + " - " + message.author.username
                    }
                }})
                }) }
            }else{
                if (message.content == '=shop') {
                    try {
                        var data = db.getData("/game/" + message.author.id);
                    } catch(error) {
                        lstmsg = message
                        initErr();
                    };
                    if (data) {
                    var diamonds = db.getData("/game/" + message.author.id + "/objects/diamonds")
                    var golds = db.getData("/game/" + message.author.id + "/objects/golds")
                    var irons = db.getData("/game/" + message.author.id + "/objects/irons")
                    var woods = db.getData("/game/" + message.author.id + "/objects/woods")
                    var xp = db.getData("/game/" + message.author.id + "/xp")
                    // if (speakEnglish(message.author)) { message.channel.send(":shopping_bags: **Welcome to Plug² shop, " + message.author.username + "! Here is what we have right now:**\n\n:shopping_cart: **On the shelf:**\n1 :: `5⛏` :: 1 iron ingot\n2 :: `5🏳️` :: 1 gold nugget\n3 :: `5🔶` :: 1 diamond\n4 :: `3🔷` :: Pionnier role\n\n:gift: **Make a gift:**\n1 :: `10⛏` :: Gift 10 wooden planks\n2 :: `10🏳️` :: Gift 10 iron ingots\n3 :: `10🔶` :: Gift 10 gold nuggets\n4 :: `10🎚` :: Gift 10 XP points\n\n:moneybag: **Your balance:**\n     :level_slider: **XP points for current level**: " + xp + "/500\n     :large_blue_diamond: **Diamonds**: " + diamonds + "\n     :large_orange_diamond: **Gold nuggets**: " + golds + "\n     :flag_white: **Iron ingots**: " + irons + "\n     :pick: **Wooden planks**: " + woods + "\n\n**Commands:**\nBuy a thing: `=shop [ElementIdentifier]`\nMake a gift: `=give [GiftIdentifier] [UserPing]`\nRedeem awaiting packages: `=redeem`") } else { message.channel.send(":shopping_bags: **Bienvenue dans la boutique Plug², " + message.author.username + " ! Voici les articles que nous avons actuellement :**\n\n:shopping_cart: **En stock :**\n1 :: `5⛏` :: 1 lingot de fer\n2 :: `5🏳️` :: 1 pépite d'or\n3 :: `5🔶` :: 1 diamant\n4 :: `3🔷` :: Grade Pionnier\n\n:gift: **Donner en cadeau :**\n1 :: `10⛏` :: Donner 10 planches de bois\n2 :: `10🏳️` :: Donner 10 lingots de fer\n3 :: `10🔶` :: Donner 10 pépites d'or\n4 :: `10🎚` :: Donner 10 points d'expérience\n\n:moneybag: **Votre solde :**\n     :level_slider: **Points d'expérience pour le niveau actuel** : " + xp + "/500\n     :large_blue_diamond: **Diamants** : " + diamonds + "\n     :large_orange_diamond: **Pépites d'or** : " + golds + "\n     :flag_white: **Lingots de fer** : " + irons + "\n     :pick: **Planches de bois** : " + woods + "\n\n**Commandes :**\nAcheter un article : `=shop [IdentifiantArticle]`\nFaire un cadeau : `=give [IdentifiantCadeau] [MentionUtilisateur]`\nRécupérer les cadeaux : `=redeem`") }
                    if (speakEnglish(message.author)) { message.channel.send({embed: {
                        color: 0x33cc33,
                        author: {
                            name: "Horigame"
                        },
                        title: "Welcome to " + message.guild.name + " shop!",
                        description: ":shopping_bags: Get ready to buy!",
                        fields: [{
                            name: "On the shelf",
                            value: "**ID: ** `1`\n**Name:** 1 iron ingot\n**Price:** 5 wooden planks\n\n**ID: ** `2`\n**Name:** 1 golden nugget\n**Price:** 5 iron ingots\n\n**ID: ** `3`\n**Name:** 1 diamond\n**Price:** 5 gold nuggets\n\n**ID: ** `4`\n**Name:** Pionner role *(beta, only on Plug X)*\n**Price:** 3 diamonds"
                        },
                        {
                            name: "Making gifts",
                            value: "`1` : Give 10 wooden planks\n`2` : Give 10 iron ingots\n`3` : Give 10 golden nuggets\,`4` : Give 10 XP points"
                        }],
                        footer: {
                            text: "Version " + HorizonVer + " - " + message.author.username
                        }
                    }}) } else { message.channel.send({embed: {
                        color: 0x33cc33,
                        author: {
                            name: "Horigame"
                        },
                        title: "Bienvenue au magasin de " + message.guild.name + " !",
                        description: ":shopping_bags: Soyez prêt(e) à acheter !",
                        fields: [{
                            name: "En stock",
                            value: "**Identifiant : ** `1`\n**Nom :** 1 lingot de fer\n**Prix :** 5 planches en bois\n\n**Identifiant : ** `2`\n**Nom :** 1 pépite d'or\n**Prix :** 5 lingots de fer\n\n**Identifiant : ** `3`\n**Nom :** 1 diamant\n**Prix :** 5 pépites d'or\n\n**Identifiant : ** `4`\n**Nom :** Rôle Pionnier *(bêta, uniquement sur Plug X)*\n**Prix :** 3 diamants"
                        },
                        {
                            name: "Faisons des cadeaux",
                            value: "`1` : Donner 10 planches de bois\n`2` : Donner 10 lingots de fer\n`3` : Donner 10 pépites d'or\,`4` : Donner 10 points d'expérience"
                        }],
                        footer: {
                            text: "Version " + HorizonVer + " - " + message.author.username
                        }
                    }}) }
                }}else{
                if (message.content.startsWith("=shop ")) {
                    lstmsg = message
                    checkShop();
                }else{
                    if (message.content.startsWith("=give ")) {
                        lstmsg = message
                        checkGift();
                    }else{
                        if (message.content == '=give') {
                            // if (speakEnglish(message.author)) { message.channel.send(":gift: **`=give` is used to donate to an user**\n\n**Syntax:**\n       `=give <GiftIdentifier> <UserPing>`\n\n**Conditions:**\n       **1.** Gift identifier needs to be valid. You can use `=shop` to see more...\n       **2.** User needs to be on this server\n       **3.** User needs to have initialized its profile") } else { message.channel.send(":gift: **`=give` permet de faire un don à un membre**\n\n**Syntaxe :**\n       `=give <IdentifiantCadeau> <MentionUtilisateur>`\n\n**Conditions :**\n       **1.** L'identifiant cadeau doit être valide. Vous pouvez utiliser `=shop` pour en savoir plus...\n       **2.** L'utilisateur doit être présent sur le serveur\n       **3.** L'utilisateur doit déjà avoir initialisé son profil") }
                            if (speakEnglish(message.author)) { message.channel.send({embed: {
                                // color: 0x33cc33,
                                author: {
                                    name: "Horigame"
                                },
                                title: ":gift: `=give`",
                                description: "This command is used to make a gift to another user",
                                fields: [{
                                    name: "Conditions",
                                    value: "1. User needs to be on this server\n2. Gift identifier needs to be valid\n3. User needs to have created its profile"
                                },
                                {
                                    name: "Syntax",
                                    value: "`=give [gift identifier] [user @-ing]`"
                                }],
                                footer: {
                                    text: "Version " + HorizonVer + " - " + message.author.username
                                }
                            }}) } else { message.channel.send({embed: {
                                // color: 0x33cc33,
                                author: {
                                    name: "Horigame"
                                },
                                title: ":gift: `=give`",
                                description: "Cette commande est utilisée pour faire un cadeau à un autre membre",
                                fields: [{
                                    name: "Conditions",
                                    value: "1. L'utilisateur doit être sur ce serveur\n2. L'identifiant cadeau doit être valide\n3. L'utilisateur doit avoir initialisé son profil"
                                },
                                {
                                    name: "Syntaxe",
                                    value: "`=give [identifiant cadeau] [mention utilisateur]`"
                                }],
                                footer: {
                                    text: "Version " + HorizonVer + " - " + message.author.username
                                }
                            }}) }
                        }else{
                            if (message.content == '=redeem') {
                                try {
                                    var data = db.getData("/game/" + message.author.id);
                                } catch(error) {
                                    lstmsg = message
                                    initErr();
                                };
                                if (data) {
                                    var goldPack = db.getData("/game/" + message.author.id + "/bonus/goldPack")
                                    var ironPack = db.getData("/game/" + message.author.id + "/bonus/ironPack")
                                    var woodPack = db.getData("/game/" + message.author.id + "/bonus/woodPack")
                                    var xpBottle = db.getData("/game/" + message.author.id + "/bonus/xpBottle")
                                    var xp = db.getData("/game/" + message.author.id + "/xp")
                                    var golds = db.getData("/game/" + message.author.id + "/objects/golds")
                                    var irons = db.getData("/game/" + message.author.id + "/objects/irons")
                                    var woods = db.getData("/game/" + message.author.id + "/objects/woods")
                                    if (xpBottle >= 1 || woodPack >= 1 || ironPack >= 1 || goldPack >= 1) {
                                        if (xpBottle >= 1) {
                                            var gainXp = xpBottle * 10
                                            db.push("/game/" + message.author.id + "/xp", xp + (xpBottle * 10))
                                            db.push("/game/" + message.author.id + "/bonus/xpBottle", 0)
                                        }else{
                                            var gainXp = 0
                                        }
                                        if (woodPack >= 1) {
                                            var gainWood = woodPack * 10
                                            db.push("/game/" + message.author.id + "/objects/woods", woods + (woodPack * 10))
                                            db.push("/game/" + message.author.id + "/bonus/woodPack", 0)
                                        }else{
                                            var gainWood = 0
                                        }
                                        if (ironPack >= 1) {
                                            var gainIron = ironPack * 10
                                            db.push("/game/" + message.author.id + "/objects/irons", irons + (ironPack * 10))
                                            db.push("/game/" + message.author.id + "/bonus/ironPack", 0)
                                        }else{
                                            var gainIron = 0
                                        }
                                        if (goldPack >= 1) {
                                            var gainGold = goldPack * 10
                                            db.push("/game/" + message.author.id + "/objects/irons", golds + (goldPack * 10))
                                            db.push("/game/" + message.author.id + "/bonus/goldPack", 0)
                                        }else{
                                            var gainGold = 0
                                        }
                                        // if (speakEnglish(message.author)) { message.channel.send(":gift: **All packages was been opened!**\n\n__**Results:**__\n**+" + gainXp + "** XP points\n**+" + gainWood + "** wooden planks\n**+" + gainIron + "** iron ingots\n**+" + gainGold + "** gold nuggets") } else { message.channel.send(":gift: **Tous les packets ont bien été ouverts !**\n\n__**Résultats :**__\n**+" + gainXp + "** points d'expérience\n**+" + gainWood + "** planches de bois\n**+" + gainIron + "** lingots de fer\n**+" + gainGold + "** pépites d'or") }
                                        if (speakEnglish(message.author)) { message.channel.send({embed: {
                                            color: 0x33cc33,
                                            author: {
                                                name: "Horigame"
                                            },
                                            title: "Results",
                                            description: ":gift: All packages were opened!",
                                            fields: [{
                                                name: "Gain XP points",
                                                value: gainXp
                                            },
                                            {
                                                name: "Gain wooden planks",
                                                value: gainWood
                                            },
                                            {
                                                name: "Gain iron ingots",
                                                value: gainIron
                                            },
                                            {
                                                name: "Gain golden nuggets",
                                                value: gainGold
                                            }],
                                            footer: {
                                                text: "Version " + HorizonVer + " - " + message.author.username
                                            }
                                        }}) } else { message.channel.send({embed: {
                                            color: 0x33cc33,
                                            author: {
                                                name: "Horigame"
                                            },
                                            title: "Résultats",
                                            description: ":gift: Tous les paquets ont été ouverts !",
                                            fields: [{
                                                name: "Points d'expérience gagnés",
                                                value: gainXp
                                            },
                                            {
                                                name: "Planches de bois gagnées",
                                                value: gainWood
                                            },
                                            {
                                                name: "Lingots de fer gagnés",
                                                value: gainIron
                                            },
                                            {
                                                name: "Pépites d'or gagnées",
                                                value: gainGold
                                            }],
                                            footer: {
                                                text: "Version " + HorizonVer + " - " + message.author.username
                                            }
                                        }}) }
                                    }else{
                                        if (speakEnglish(message.author)) { message.channel.send({embed: {
                                            color: 0xff0000,
                                            author: {
                                                name: "Horigame"
                                            },
                                            title: "Error",
                                            description: ":no_entry_sign: You don't have any awaiting packages.",
                                            footer: {
                                                text: "Version " + HorizonVer + " - " + message.author.username
                                            }
                                        }}) } else { message.channel.send({embed: {
                                            color: 0xff0000,
                                            author: {
                                                name: "Horigame"
                                            },
                                            title: "Erreur",
                                            description: ":no_entry_sign: Vous n'avez aucun paquet à récupérer.",
                                            footer: {
                                                text: "Version " + HorizonVer + " - " + message.author.username
                                            }
                                        }}) }
                                    }
                                }
                            }else{
                if (message.content.startsWith('=te ')) {
                    if (speakEnglish(message.author)) {
                        message.channel.send({embed: {
                            color: 0xff0000,
                            author: {
                                name: "Horigame"
                            },
                            description: "The translation feature isn't available",
                            fields: [{
                                name: "Why?",
                                value: "The **Google Translate** API, that we've used before, isn't available for free now."
                            }],
                            footer: {
                                text: "Horizon " + HorizonVer + " - " + message.author.username
                            }
                        }})
                    } else {
                        message.channel.send({embed: {
                            color: 0xff0000,
                            author: {
                                name: "Horigame"
                            },
                            description: "La fonction de traduction n'est plus disponible",
                            fields: [{
                                name: "Pourquoi ?",
                                value: "L'API **Google Traduction**, que nous utilisions avant, n'est malheureusement plus disponible gratuitement."
                            }],
                            footer: {
                                text: "Horizon " + HorizonVer + " - " + message.author.username
                            }
                        }})
                    }
                }else{
                    if (message.content.startsWith('=tf ')) {
                        if (speakEnglish(message.author)) {
                            message.channel.send({embed: {
                                color: 0xff0000,
                                author: {
                                    name: "Horigame"
                                },
                                description: "The translation feature isn't available",
                                fields: [{
                                    name: "Why?",
                                    value: "The **Google Translate** API, that we've used before, isn't available for free now."
                                }],
                                footer: {
                                    text: "Horizon " + HorizonVer + " - " + message.author.username
                                }
                            }})
                        } else {
                            message.channel.send({embed: {
                                color: 0xff0000,
                                author: {
                                    name: "Horigame"
                                },
                                description: "La fonction de traduction n'est plus disponible",
                                fields: [{
                                    name: "Pourquoi ?",
                                    value: "L'API **Google Traduction**, que nous utilisions avant, n'est malheureusement plus disponible gratuitement."
                                }],
                                footer: {
                                    text: "Horizon " + HorizonVer + " - " + message.author.username
                                }
                            }})
                        }
                    }else{
                        if (message.content.startsWith('=tj ')) {
                            if (speakEnglish(message.author)) {
                                message.channel.send({embed: {
                                    color: 0xff0000,
                                    author: {
                                        name: "Horigame"
                                    },
                                    description: "The translation feature isn't available",
                                    fields: [{
                                        name: "Why?",
                                        value: "The **Google Translate** API, that we've used before, isn't available for free now."
                                    }],
                                    footer: {
                                        text: "Horizon " + HorizonVer + " - " + message.author.username
                                    }
                                }})
                            } else {
                                message.channel.send({embed: {
                                    color: 0xff0000,
                                    author: {
                                        name: "Horigame"
                                    },
                                    description: "La fonction de traduction n'est plus disponible",
                                    fields: [{
                                        name: "Pourquoi ?",
                                        value: "L'API **Google Traduction**, que nous utilisions avant, n'est malheureusement plus disponible gratuitement."
                                    }],
                                    footer: {
                                        text: "Horizon " + HorizonVer + " - " + message.author.username
                                    }
                                }})
                            }
                        }else{
                            if (message.content.startsWith('=tl ')) {
                                if (speakEnglish(message.author)) {
                                    message.channel.send({embed: {
                                        color: 0xff0000,
                                        author: {
                                            name: "Horigame"
                                        },
                                        description: "The translation feature isn't available",
                                        fields: [{
                                            name: "Why?",
                                            value: "The **Google Translate** API, that we've used before, isn't available for free now."
                                        }],
                                        footer: {
                                            text: "Horizon " + HorizonVer + " - " + message.author.username
                                        }
                                    }})
                                } else {
                                    message.channel.send({embed: {
                                        color: 0xff0000,
                                        author: {
                                            name: "Horigame"
                                        },
                                        description: "La fonction de traduction n'est plus disponible",
                                        fields: [{
                                            name: "Pourquoi ?",
                                            value: "L'API **Google Traduction**, que nous utilisions avant, n'est malheureusement plus disponible gratuitement."
                                        }],
                                        footer: {
                                            text: "Horizon " + HorizonVer + " - " + message.author.username
                                        }
                                    }})
                                }
                            }else if (message.content.startsWith('=help')) {
                                // if (speakEnglish(message.author)) { message.channel.send(":question: **What can we do with ~~Horizon~~ __Horigame__?**\n\nHelp looks like that:\n`=[command] [required:type] (optional:type)`\n     Commands details\n     Required elements: `guild`\n\n__Help:__\n`=shop (identifier:shopId)`\n     Used to buy an object on Plug² shop, or see what's on the shelf\n     Required elements: `guild`,`profile`\n\n`=stats (null:null)`\n     Show your statistics\n     Required elements: `guild`,`profile`\n\n`=give [identifier:giftId] [member:snowflake]`\n     Donate to a user\n     Required elements: `guild`,`profile`,`balance > 0`\n\n`=t[language:1charlang] [text:string]`\n     Translate a text to another language (`f` for french, `e` for english, `j` for japanese, and `l` for latin)\n     Required elements: `guild`,`googleTranslateApi`\n\n`=redeem (null:null)`\n     Redeem awaiting packages\n     Required elements: `guild`,`profile`,`redeemablePacks > 0`\n\n`=help (null:null)`\n     Show this help message\n     Required elements: `guild`\n\n`=reset (*)`\n     Reset your profile\n     Required profile: `guild`,`profile`\n\n`=init (null:null)`\n     Initialize your profile\n     Required elements: `guild`,`noProfile`\n\n`=push [channel:pushchannel]`\n     Alter notifications settings\n     Required elements: `guild`,`profile`\n\n`=fr (null:null)`\n     Sets your personal language to french\n     Required elements: `guild`,`profile`\n\n`=en (null:null)`\n     Sets your personal language to english\n    Required elements: `guild`,`profile`") } else { message.channel.send(":question: **Que pouvons nous donc faire avec ~~Horizon~~ __Horigame__ ?**\n\nL'aide sera présentée ainsi :\n`=[commande] [obligatoire:type] (facultatif:type)`\n     Détails de la commande\n     Éléments requis : `guild`\n\n__Aide :__\n`=shop (identifiant:shopId)`\n     Permet d'acheter un objet dans la boutique Plug², ou de consulter les stocks\n     Éléments requis : `guild`,`profile`\n\n`=stats (null:null)`\n     Affiche vos statistiques\n     Éléments requis : `guild`,`profile`\n\n`=give [identifiant:giftId] [utilisateur:snowflake]`\n     Fait un don à un autre utilisateur\n     Éléments requis : `guild`,`profile`,`balance > 0`\n\n`=t[langue:1charlang] [texte:string]`\n     Traduit un texte en une langue (`f` pour français, `e` pour anglais, `j` pour japonais, et `l` pour latin)\n     Éléments requis : `guild`,`googleTranslateApi`\n\n`=redeem (null:null)`\n     Récupère les lots en attente\n     Éléments requis : `guild`,`profile`,`redeemablePacks > 0`\n\n`=help (null:null)`\n     Affiche ce message d'aide\n     Éléments requis : `guild`\n\n`=reset (*)`\n     Réinitialise votre profil\n     Éléments requis : `guild`,`profile`\n\n`=init (null:null)`\n     Initialise votre profil utilisateur\n     Éléments requis : `guild`,`noProfile`\n\n`=push [canal:pushchannel]`\n     Altère les préférences de notification\n     Éléments requis : `guild`,`profile`\n\n`=fr (null:null)`\n     Définit votre langue personnelle sur le français\n     Éléments requis : `guild`,`profile`\n\n`=en (null:null)`\n     Définit votre langue personnelle sur l'anglais\n     Éléments requis : `guild`,`profile`") }
                                if (speakEnglish(message.author)) { message.channel.send({embed: {
                                    // color: 0x33cc33,
                                    author: {
                                        name: "Hello there, I'm Horizon!"
                                    },
                                    title: "I'd like to teach you about Horigame!",
                                    description: "Horigame is a level-reward game were you can buy great perks with the money you get each level you up.\nEach command starts with `=`!\n\nBut let's see the list of commands!",
                                    fields: [{
                                        name: "=shop",
                                        value: "Opens the shop, were you can buy great perks\n\n**Optional: ** `item` : The ID of the item you want to buy"
                                    },
                                    {
                                        name: "=stats",
                                        value: "Show your stats (XP, inventory, and so on)\n\n**No Arguments Expected**"
                                    },
                                    {
                                        name: "=ping",
                                        value: "Get the latency between Horizon and Discord\n\n**No Arguments Expected**"
                                    },
                                    {
                                        name: "=invite",
                                        value: "Join the support server\n\n**No Arguments Expected**"
                                    },
                                    {
                                        name: "=give",
                                        value: "Give a resource from your inventory to the inventory of someone else\n\n**Required: ** `item` : The ID of the item you want to give\n**Required: ** `member` : The @-ing for the user you want to give to"
                                    },
                                    {
                                        name: "=tf",
                                        value: "Translate a text to French\n\n**Required: ** `text` : The text to translate to French"
                                    },
                                    {
                                        name: "=te",
                                        value: "Translate a text to English\n\n**Required: ** `text` : The text to translate to English"
                                    },
                                    {
                                        name: "=tj",
                                        value: "Translate a text to Japanese\n\n**Required: ** `text` : The text to translate to Japanese"
                                    },
                                    {
                                        name: "=tl",
                                        value: "Translate a text to Latin\n\n**Required: ** `text` : The text to translate to Latin"
                                    },
                                    {
                                        name: "=redeem",
                                        value: "Redeem all received packages\n\n*No Arguments Expected*"
                                    },
                                    {
                                        name: "=help",
                                        value: "Show this help message\n\n*No Arguments Expected*"
                                    },
                                    {
                                        name: "=info",
                                        value: "Show info about Horizon\n\n*No Arguments Expected*"
                                    },
                                    {
                                        name: "=reset",
                                        value: "Reset your profile to factory defaults\n\n*No Arguments Expected*"
                                    },
                                    {
                                        name: "=init",
                                        value: "Create your profile\n\n*No Arguments Expected*"
                                    },
                                    {
                                        name: "=push",
                                        value: "Manage notifications settings\n\n**Required: ** `notifications_channel` : The notifications channel to configure"
                                    },
                                    {
                                        name: "=fr",
                                        value: "Sets your personal language to French\n\n*No Arguments Expected*"
                                    },
                                    {
                                        name: "=en",
                                        value: "Sets your personal language to English\n\n*No Arguments Expected*"
                                    }],
                                    footer: {
                                        text: "Version " + HorizonVer + " - " + message.author.username
                                    }
                                }}) } else { message.channel.send({embed: {
                                        // color: 0x33cc33,
                                        author: {
                                            name: "Coucou tout le monde, moi c'est Horizon !"
                                        },
                                        title: "Je suis là pour vous apprendre à utiliser Horigame !",
                                        description: "Horigame est un jeu de financement participatif virtuel où vous pouvez acheter des effets cool sur le serveur avec l'argent que vous gagnez à chaque montée de niveau.\nToutes les commandes commencent par `=` !\n\nMais, voyons-en la liste :",
                                        fields: [{
                                            name: "=shop",
                                            value: "Ouvre le magasin, dans lequel vous pouvez ajouter des effets cool\n\n**Optionnel : ** `element` : L'identifiant de l'élément que vous souhaitez acheter"
                                        },
                                        {
                                            name: "=stats",
                                            value: "Affiche vos statistiques (expérience, inventaire, et bien plus)\n\n**Aucun argument attendu**"
                                        },
                                        {
                                            name: "=ping",
                                            value: "Affiche la latence entre Horizon et Discord\n\n**Aucun argument attendu**"
                                        },
                                        {
                                            name: "=invite",
                                            value: "Rejoindre le serveur de support\n\n**Aucun argument attendu**"
                                        },
                                        {
                                            name: "=give",
                                            value: "Donne une ressource de votre inventaire à celui de l'inventaire de quelqu'un d'autre\n\n**Requis : ** `element` : L'identifiant de l'élément que vous voulez donner\n**Requis : ** `membre` : La mention de l'utilisateur à qui donner la ressource"
                                        },
                                        {
                                            name: "=tf",
                                            value: "Traduit un texte en français\n\n**Requis : ** `texte` : Le texte à traduire en français"
                                        },
                                        {
                                            name: "=te",
                                            value: "Traduit un texte en anglais\n\n**Requis : ** `texte` : Le texte à traduire en anglais"
                                        },
                                        {
                                            name: "=tj",
                                            value: "Traduit un texte en japonais\n\n**Requis : ** `texte` : Le texte à traduire en japonais"
                                        },
                                        {
                                            name: "=tl",
                                            value: "Traduit un texte en latin\n\n**Requis : ** `texte` : Le texte à traduire en latin"
                                        },
                                        {
                                            name: "=redeem",
                                            value: "Récupérer tous les paquets reçus\n\n*Aucun argument attendu*"
                                        },
                                        {
                                            name: "=help",
                                            value: "Affiche ce message d'aide\n\n*Aucun argument attendu*"
                                        },
                                        {
                                            name: "=info",
                                            value: "Affiche des informations concernant Horizon\n\n*Aucun argument attendu*"
                                        },
                                        {
                                            name: "=reset",
                                            value: "Réinitialise votre profil aux valeurs d'usine\n\n*Aucun argument attendu*"
                                        },
                                        {
                                            name: "=init",
                                            value: "Initialise votre profil\n\n*Aucun argument attendu*"
                                        },
                                        {
                                            name: "=push",
                                            value: "Gérer les notifications\n\n**Requis : ** `canal_de_notifications` : Le canal de notifications à configurer"
                                        },
                                        {
                                            name: "=fr",
                                            value: "Définir votre langue personnelle sur français\n\n*Aucun argument attendu*"
                                        },
                                        {
                                            name: "=en",
                                            value: "Définir votre langue personnelle sur anglais\n\n*Aucun argument attendu*"
                                        }],
                                        footer: {
                                            text: "Version " + HorizonVer + " - " + message.author.username
                                        }
                                }}) }
                            }else if (message.content.startsWith('=push')) {
                                try {
                                    var data = db.getData("/game/" + message.author.id);
                                } catch(error) {
                                    lstmsg = message
                                    initErr();
                                };
                                if (data) {
                                if (message.content == "=push levels") {
                                    try {
                                        var pushLevels = uconf.getData("/push/" + message.author.id + "/levels")
                                    } catch(err) {
                                        var pushLevels = true
                                    }
                                    if (pushLevels === true) {
                                        uconf.push("/push/" + message.author.id + "/levels", false)
                                        if (speakEnglish(message.author)) { message.channel.send({embed: {
                                            color: 0x33cc33,
                                            author: {
                                                name: "Horigame"
                                            },
                                            title: "Success",
                                            description: ":no_bell: Notifications for `gifts` will now **be not send** to you.",
                                            footer: {
                                                text: "Version " + HorizonVer + " - " + message.author.username
                                            }
                                        }}) } else { message.channel.send({embed: {
                                            color: 0x33cc33,
                                            author: {
                                                name: "Horigame"
                                            },
                                            title: "Succès",
                                            description: ":no_bell: Les notifications pour `gifts` vont maintenant **ne plus vous être envoyées**.",
                                            footer: {
                                                text: "Version " + HorizonVer + " - " + message.author.username
                                            }
                                        }}) }
                                    }
                                    if (pushLevels === false) {
                                        uconf.push("/push/" + message.author.id + "/levels", true)
                                        if (speakEnglish(message.author)) { message.channel.send({embed: {
                                            color: 0x33cc33,
                                            author: {
                                                name: "Horigame"
                                            },
                                            title: "Success",
                                            description: ":bell: Notifications for `levels` will now **be send** to you.",
                                            footer: {
                                                text: "Version " + HorizonVer + " - " + message.author.username
                                            }
                                        }}) } else { message.channel.send({embed: {
                                            color: 0x33cc33,
                                            author: {
                                                name: "Horigame"
                                            },
                                            title: "Succès",
                                            description: ":bell: Les notifications pour `levels` vont maintenant **vous être envoyées**.",
                                            footer: {
                                                text: "Version " + HorizonVer + " - " + message.author.username
                                            }
                                        }}) }
                                    }
                                } else if (message.content == "=push gifts") {
                                    try {
                                        var pushLevels = uconf.getData("/push/" + message.author.id + "/gifts")
                                    } catch(err) {
                                        var pushLevels = true
                                    }
                                    if (pushLevels === true) {
                                        uconf.push("/push/" + message.author.id + "/gifts", false)
                                        if (speakEnglish(message.author)) { message.channel.send({embed: {
                                            color: 0x33cc33,
                                            author: {
                                                name: "Horigame"
                                            },
                                            title: "Success",
                                            description: ":no_bell: Notifications for `gifts` will now **be not send** to you.",
                                            footer: {
                                                text: "Version " + HorizonVer + " - " + message.author.username
                                            }
                                        }}) } else { message.channel.send({embed: {
                                            color: 0x33cc33,
                                            author: {
                                                name: "Horigame"
                                            },
                                            title: "Succès",
                                            description: ":no_bell: Les notifications pour `gifts` vont maintenant **ne plus vous être envoyées**.",
                                            footer: {
                                                text: "Version " + HorizonVer + " - " + message.author.username
                                            }
                                        }}) }
                                    }
                                    if (pushLevels === false) {
                                        uconf.push("/push/" + message.author.id + "/gifts", true)
                                        if (speakEnglish(message.author)) { message.channel.send({embed: {
                                            color: 0x33cc33,
                                            author: {
                                                name: "Horigame"
                                            },
                                            title: "Success",
                                            description: ":bell: Notifications for `gifts` will now **be send** to you.",
                                            footer: {
                                                text: "Version " + HorizonVer + " - " + message.author.username
                                            }
                                        }}) } else { message.channel.send({embed: {
                                            color: 0x33cc33,
                                            author: {
                                                name: "Horigame"
                                            },
                                            title: "Succès",
                                            description: ":bell: Les notifications pour `gifts` vont maintenant **vous être envoyées**.",
                                            footer: {
                                                text: "Version " + HorizonVer + " - " + message.author.username
                                            }
                                        }}) }
                                    }
                                } else if (message.content == "=push") {
                                    // if (speakEnglish(message.author)) { message.channel.send("**`=push` can be used to manage Horigame's notification settings by specific channels.**\n\n**Note:** Horigame's notification are sent on direct messages.\n\n__**Available notification channels:**__\n`levels` - Notifications when you pass a level\n`gifts` - Notifications when you recieve gifts\n\nUse `=push [channel]` to alter configuration.") } else { message.channel.send("**`=push` vous permet de gérer vos paramètres de notification de Horigame pour des canaux particuliers.**\n\n**Note :** Les notifications de Horigame vous sont envoyées par messages privés.\n\n__**Canaux de notification disponibles :**__\n`levels` - Messages lorsque vous passez un niveau\n`gifts` - Messages lorsque vous recevez des lots en cadeau.\n\nUtilisez `=push [canal]` pour altérer la configuration.") }
                                    if (speakEnglish(message.author)) { message.channel.send({embed: {
                                        color: 0x33cc33,
                                        author: {
                                            name: "Horigame"
                                        },
                                        title: "`=push`",
                                        description: "Manage Horigame notifications\n**Usage: ** `=push <channel>`\n\n**Channels List:**",
                                        fields: [{
                                            name: "gifts",
                                            value: "Notifications when you receive a gift"
                                        },
                                        {
                                            name: "levels",
                                            value: "Notifications when you level-up"
                                        }],
                                        footer: {
                                            text: "Version " + HorizonVer + " - " + message.author.username
                                        }
                                    }}) } else { message.channel.send({embed: {
                                        color: 0x33cc33,
                                        author: {
                                            name: "Horigame"
                                        },
                                        title: "`=push`",
                                        description: "Gérez les notifications de Horigame\n**Utilisation : ** `=canal <channel>`\n\n**Liste des canaux :**",
                                        fields: [{
                                            name: "gifts",
                                            value: "Notifications when you receive a gift"
                                        },
                                        {
                                            name: "levels",
                                            value: "Notifications when you level-up"
                                        }],
                                        footer: {
                                            text: "Version " + HorizonVer + " - " + message.author.username
                                        }
                                    }}) }
                                    
                                } else {
                                    let args = message.content.split(' ');
                                    args.shift();
                                    let text = args.join(' ')
                                    args = text.split(' ');
                                    args.shift();
                                    text = args.join(' ')
                                    if (speakEnglish(message.author)) { message.channel.send({embed: {
                                        color: 0xff0000,
                                        author: {
                                            name: "Horigame"
                                        },
                                        title: "Error",
                                        description: ":no_entry: The " + text + " notification channel cannot be found.",
                                        fields: [{
                                            name: "Get Help",
                                            value: "Enter the `=push` command to see list of all notification channels"
                                        }],
                                        footer: {
                                            text: "Version " + HorizonVer + " - " + message.author.username
                                        }
                                    }}) } else { message.channel.send({embed: {
                                        color: 0xff0000,
                                        author: {
                                            name: "Horigame"
                                        },
                                        title: "Erreur",
                                        description: ":no_entry: Le canal de notifications " + text + " ne peut pas être trouvé.",
                                        fields: [{
                                            name: "Obtenez de l'aide",
                                            value: "Entrez la commande `=push` pour obtenir la liste des canaux de notification"
                                        }],
                                        footer: {
                                            text: "Version " + HorizonVer + " - " + message.author.username
                                        }
                                    }}) }
                                }}
                            }else if (message.content.startsWith('=ping')) {
                                if (ping < 150) {
                                    var color = 0x33cc33
                                } else if (ping < 300) {
                                    var color = 0xffcc00
                                } else {
                                    var color = 0xff0000
                                }
                                if (speakEnglish(message.author)) {
                                    message.channel.send({embed: {
                                        color: color,
                                        author: {
                                            name: "Horigame"
                                        },
                                        title: "Ping",
                                        description: "Pong! It took " + Math.round(ping) + " milliseconds!",
                                        footer: {
                                            text: "Version " + HorizonVer + " - " + message.author.username
                                        }
                                    }})
                                } else {
                                    message.channel.send({embed: {
                                        color: color,
                                        author: {
                                            name: "Horigame"
                                        },
                                        title: "Latences",
                                        description: "Pong ! Je vous ai répondu en " + Math.round(ping) + " millisecondes !",
                                        footer: {
                                            text: "Version " + HorizonVer + " - " + message.author.username
                                        }
                                    }})
                                }
                            }else if (message.content.startsWith('=invite')) {
                                if (message.guild.id == "408345017070125076") {
                                    if (speakEnglish(message.author)) {
                                        try {
                                            let guild = client.guilds.get('575389787737817099');
                                            let channel = guild.channels.get('575415301026611220');
                                            channel.fetchMessages({ limit: 1 }).then(messages => {
                                                let lastMessaget1 = messages.first();
                                              
                                                lstmsgpx = lastMessaget1.content
                                              })
                                        } catch (err) {
                                            lstmsgpx = "*(unable to get last message : " + err.toString() + ")*";
                                        }
                                        message.channel.send("https://discordapp.com/invite/FW8CqYQ")
                                        message.channel.send({embed: {
                                            color: 0x33cc33,
                                            author: {
                                                name: "Horigame"
                                            },
                                            title: "Join Horizon.Data's server",
                                            description: "Join the Horizon.Data's server to see latest Horizon changes",
                                            fields: [{
                                                name: "Latest message in #général channel",
                                                value: lstmsgpx
                                            }],
                                            footer: {
                                                text: "Version " + HorizonVer + " - " + message.author.username
                                            }
                                        }})
                                    } else {
                                        try {
                                            let guild = client.guilds.get('575389787737817099');
                                            let channel = guild.channels.get('575415301026611220');
                                            channel.fetchMessages({ limit: 1 }).then(messages => {
                                                let lastMessaget1 = messages.first();
                                              
                                                lstmsgpx = lastMessaget1.content
                                              })
                                        } catch (err) {
                                            lstmsgpx = "*(impossible de récupérer le dernier message envoyé : " + err.toString() + ")*";
                                        }
                                        message.channel.send("https://discordapp.com/invite/FW8CqYQ")
                                        message.channel.send({embed: {
                                            color: 0x33cc33,
                                            author: {
                                                name: "Horigame"
                                            },
                                            title: "Rejoindre le serveur d'Horizon.Data",
                                            description: "Rejoignez le serveur d'Horizon.Data' pour être au courant des dernières nouveautés sur Horizon",
                                            fields: [{
                                                name: "Dernier message envoyé dans le salon #global",
                                                value: lstmsgpx
                                            }],
                                            footer: {
                                                text: "Version " + HorizonVer + " - " + message.author.username
                                            }
                                        }})
                                    }
                                } else {
                                    if (speakEnglish(message.author)) {
                                        try {
                                            let guild = client.guilds.get('408345017070125076');
                                            let channel = guild.channels.get('408345017070125078');
                                            channel.fetchMessages({ limit: 1 }).then(messages => {
                                                let lastMessaget1 = messages.first();
                                              
                                                lstmsgpx = lastMessaget1.content
                                              })
                                        } catch (err) {
                                            lstmsgpx = "*(unable to get last message : " + err.toString() + ")*";
                                        }
                                        message.channel.send("https://discordapp.com/invite/rYPqfUg")
                                        message.channel.send({embed: {
                                            color: 0x33cc33,
                                            author: {
                                                name: "Horigame"
                                            },
                                            title: "Join Minteck's server",
                                            description: "Join the Minteck's server to see latest Horizon changes",
                                            fields: [{
                                                name: "Latest message in #global channel",
                                                value: lstmsgpx
                                            }],
                                            footer: {
                                                text: "Version " + HorizonVer + " - " + message.author.username
                                            }
                                        }})
                                    } else {
                                        try {
                                            let guild = client.guilds.get('408345017070125076');
                                            let channel = guild.channels.get('408345017070125078');
                                            channel.fetchMessages({ limit: 1 }).then(messages => {
                                                let lastMessaget1 = messages.first();
                                              
                                                lstmsgpx = lastMessaget1.content
                                              })
                                        } catch (err) {
                                            lstmsgpx = "*(impossible de récupérer le dernier message envoyé : " + err.toString() + ")*";
                                        }
                                        message.channel.send("https://discordapp.com/invite/rYPqfUg")
                                        message.channel.send({embed: {
                                            color: 0x33cc33,
                                            author: {
                                                name: "Horigame"
                                            },
                                            title: "Rejoindre le serveur de Minteck",
                                            description: "Rejoignez le serveur de Minteck pour être au courant des dernières nouveautés sur Horizon",
                                            fields: [{
                                                name: "Dernier message envoyé dans le salon #global",
                                                value: lstmsgpx
                                            }],
                                            footer: {
                                                text: "Version " + HorizonVer + " - " + message.author.username
                                            }
                                        }})
                                    }
                                }
                            }else if (message.content.startsWith('=fr')) {
                                uconf.push('/lang/' + message.author.id, 'fr')
                                message.channel.send({embed: {
                                    color: 0x33cc33,
                                    author: {
                                        name: "Horigame"
                                    },
                                    title: "Succès",
                                    description: ":flag_fr: Votre langue personnelle a bien été définie sur **Français (International)** !",
                                    footer: {
                                        text: "Version " + HorizonVer + " - " + message.author.username
                                    }
                                }})
                            }else if (message.content.startsWith('=en')) {
                                uconf.push('/lang/' + message.author.id, 'en')
                                message.channel.send({embed: {
                                    color: 0x33cc33,
                                    author: {
                                        name: "Horigame"
                                    },
                                    title: "Success",
                                    description: ":flag_us: Your personal language was set to **English (International)**!",
                                    footer: {
                                        text: "Version " + HorizonVer + " - " + message.author.username
                                    }
                                }})
                            }else{
            // if (speakEnglish(message.author)) { message.channel.send(":no_entry_sign: **" + message.content + "** isn't recognized as an Horigame internal command. Check spelling and retry. - `" + message.author.username + "`") } else { message.channel.send(":no_entry_sign: **" + message.content + "** n'est pas reconnu en tant que commande interne de Horigame. Vérifiez l'orthographe et réessayez. - `" + message.author.username + "`") }
            if (message.content.startsWith("=pinpages")) {
                pinpages(message)
        } else if (message.content.startsWith("=info")) {
            if (speakEnglish(message.author)) { message.channel.send({embed: {
                author: {
                    name: "Horigame"
                },
                title: "Horigame/Horizon Information",
                description: "Horizon is a Discord bot made by two students on their free time.",
                fields: [{
                    name: "Versions",
                    value: "Horizon Version: " + HorizonVer + "\nlibhorizon Version: " + LibhorizonVer + "\nHorigame Version: " + HorigameVer + "\nSupport Bot Version: " + SupportVer + "\nNode Version: " + process.version.replace("v","")
                },
                {
                    name: "Credits",
                    value: "**Ideas and Preview**\nHorizon.Data\n\n**Development and PinPages Integration**\nMinteck"
                }],
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) } else { message.channel.send({embed: {
                author: {
                    name: "Horigame"
                },
                title: "Horigame/Horizon Information",
                description: "Horizon est un bot Discord créé par deux étudiants sur leur temps libre.",
                fields: [{
                    name: "Versions",
                    value: "Version d'Horizon : " + HorizonVer + "\nVersion de libhorizon : " + LibhorizonVer + "\nVersion d'Horigame: " + HorigameVer + "\nSupport Bot Version: " + SupportVer + "\nVersion de Node: " + process.version.replace("v","")
                },
                {
                    name: "Crédits",
                    value: "**Idées et directions**\nHorizon.Data\n\n**Développement et intégration PinPages**\nMinteck"
                }],
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) }
        } else if (speakEnglish(message.author)) { message.channel.send({embed: {
                color: 0xff0000,
                author: {
                    name: "Horigame"
                },
                title: "Error",
                description: ":no_entry_sign: The **" + message.content + "** command isn't recognized as a Horigame command. Check spelling and retry",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) } else {
                if (message.content.startsWith("=pinpages")) {
                    pinpages(message)
            } else { message.channel.send({embed: {
                color: 0xff0000,
                author: {
                    name: "Horigame"
                },
                title: "Erreur",
                description: ":no_entry_sign: La commande **" + message.content + "** n'est pas reconnue comme commande d'Horigame. Vérifiez l'orthographe et réessayez",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) }
}}}}}}}}}}}}}}}}}
try {
    var data = db.getData("/game/" + message.author.id);
} catch(error) {
};
if (data) {
    if (xpCooldown.has(message.author.id)) {blockXpUp();} else {
        xpCooldown.add(message.author.id);
    setTimeout(() => {
        xpCooldown.delete(message.author.id);
      }, 60000);
    var userXp = db.getData("/game/" + message.author.id + "/xp");
    db.push("/game/" + message.author.id + "/xp", userXp + 10);
    var userXp = db.getData("/game/" + message.author.id + "/xp");
    if (userXp >= 500) {
        var userLevel = db.getData("/game/" + message.author.id + "/level");
        db.push("/game/" + message.author.id + "/level", userLevel + 1);
        db.push("/game/" + message.author.id + "/xp", 0);
        var planks = db.getData("/game/" + message.author.id + "/objects/woods");
        db.push("/game/" + message.author.id + "/objects/woods", planks + 15);
        var userLevel = db.getData("/game/" + message.author.id + "/level");
        try { var setting = uconf.getData("/push/" + message.author.id + "/levels") } catch(err) { var setting = true }
        // if (setting == true) { if (speakEnglish(message.author)) { message.author.send(":tools: Hi **" + message.author.username + "**, you're now on **level " + userLevel + "**, congratulations! *(and you won 15 wooden planks)*") } else { message.author.send(":tools: Salut **" + message.author.username + "**, tu es maintenant au **niveau " + userLevel + "**, félicitations ! *(et tu gagne 15 planches de bois)*") } }
        if (setting == true) {
            if (speakEnglish(message.author)) { message.author.send({embed: {
                color: 0x33cc33,
                author: {
                    name: "Horigame"
                },
                title: "Level UP!",
                description: ":bell: **Congrats! You're now at level __" + userLevel + "__!**\nYou received 15 wooden planks...",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) } else { message.author.send({embed: {
                color: 0x33cc33,
                author: {
                    name: "Horigame"
                },
                title: "Niveau Supérieur !",
                description: ":bell: **Félicitations ! Vous êtes maintenant au niveau __" + userLevel + "__ !**\nVous avez reçu 15 planches de bois...",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) }
        }
    }
}}}}

function blockXpUp () {
    //Ne rien faire, juste empêcher l'utilisateur de gagner de l'expérience...
};

function blockMessage() {
    message = lstmsg
    // if (speakEnglish(lstmsg.author)) { lstmsg.channel.send(":warning: Hey! Why go at supersonic speed? Slow down!"); } else { lstmsg.channel.send(":warning: Et oh ! Vous allez trop vite ! Ralentissez un peu..."); }
    if (speakEnglish(message.author)) { message.channel.send({embed: {
        color: 0xffcc00,
        description: ":warning: Please slow down! Others need to use me too, and I don't want overheat...",
        footer: {
            text: "Version " + HorizonVer + " - " + message.author.username
        }
    }}) } else { message.channel.send({embed: {
        color: 0xffcc00,
        description: ":warning: Ralentissez ! Les autres ont besoin de m'utiliser aussi, et je ne veux pas surchauffer...",
        footer: {
            text: "Version " + HorizonVer + " - " + message.author.username
        }
    }}) }
};

function initErr() {
    message = lstmsg
    if (speakEnglish(message.author)) { message.channel.send({embed: {
        color: 0xff0000,
        author: {
            name: "Horigame"
        },
        title: "Error",
        description: ":no_entry: No user profile found",
        footer: {
            text: "Version " + HorizonVer + " - " + message.author.username
        }
    }}) } else { message.channel.send({embed: {
        color: 0xff0000,
        author: {
            name: "Horigame"
        },
        title: "Erreur",
        description: ":no_entry: Aucun profil utilisateur trouvé",
        footer: {
            text: "Version " + HorizonVer + " - " + message.author.username
        }
    }}) }
};

function initUser() {
    editmsg = lstmsg
    lstmsg.channel.send({embed: {
        color: 0xffffff,
        author: {
            name: "Horigame"
        },
        title: "Préparation",
        description: ":clock: Nous sommes en train de tout préparer pour vous...",
        footer: {
            text: "Version " + HorizonVer + " - " + lstmsg.author.username
        }
    }}).then((message) => {
                db.push("/game/" + lstmsg.author.id + "/level", 0);
                db.push("/game/" + lstmsg.author.id + "/xp", 20);
                db.push("/game/" + lstmsg.author.id + "/objects/diamonds", 0);
                db.push("/game/" + lstmsg.author.id + "/objects/irons", 0);
                db.push("/game/" + lstmsg.author.id + "/objects/golds", 0);
                db.push("/game/" + lstmsg.author.id + "/objects/woods", 5);
                db.push("/game/" + lstmsg.author.id + "/bonus/xpBottle", 0);
                db.push("/game/" + lstmsg.author.id + "/bonus/ironPack", 0);
                db.push("/game/" + lstmsg.author.id + "/bonus/goldPack", 0);
                db.push("/game/" + lstmsg.author.id + "/bonus/woodPack", 0);
                uconf.push('/lang/' + lstmsg.author.id, "fr");
                uconf.push('/push/' + lstmsg.author.id + "/levels", true);
                uconf.push('/push/' + lstmsg.author.id + "/gifts", true);
                message.edit({embed: {
                    color: 0x33cc33,
                    author: {
                        name: "Horigame"
                    },
                    title: "Succès",
                    description: ":white_check_mark: Et voilà ! Vous pouvez commencer à jouer",
                    fields: [{
                        name: "Pour bien démarrer",
                        value: "N'hésitez pas à faire la commande `=help` pour obtenir toutes les informations dont vous avez besoin !\nQue la chasse à l'expérience, commence !"
                    }],
                    footer: {
                        text: "Version " + HorizonVer + " - " + lstmsg.author.username
                    }
                }})
            })
}

function checkShop() {
    let message = lstmsg
    let args = message.content.split(' ');
    args.shift();
    let object = args.join(' ')
    args = object.split(' ');
    args.shift();
    let selection = args.join(' ')
    var diamonds = db.getData("/game/" + message.author.id + "/objects/diamonds")
    var golds = db.getData("/game/" + message.author.id + "/objects/golds")
    var irons = db.getData("/game/" + message.author.id + "/objects/irons")
    var woods = db.getData("/game/" + message.author.id + "/objects/woods")
    var xp = db.getData("/game/" + message.author.id + "/xp")
    if (selection == "1") {
        if (woods >= 5) {
            db.push("/game/" + message.author.id + "/objects/woods", woods - 5);
            db.push("/game/" + message.author.id + "/objects/irons", irons + 1);
            function getRandomArbitrary(min, max) {
                return Math.random() * (max - min) + min;
            }
            var commandId = getRandomArbitrary(1000000, 999999999);
            // if (speakEnglish(message.author)) { message.channel.send(":white_check_mark: Your command *#" + commandId + "* of **1 iron ingot** was done - `" + message.author.username + "`") } else { message.channel.send(":white_check_mark: Votre commande *#" + commandId + "* de **1 lingot de fer** a été validée - `" + message.author.username + "`") }
            if (speakEnglish(message.author)) { message.channel.send({embed: {
                color: 0x33cc33,
                author: {
                    name: "Horigame"
                },
                title: "Order No. " + commandId,
                description: ":white_check_mark: Your order of **1 iron ingot** was confirmed",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) } else { message.channel.send({embed: {
                color: 0x33cc33,
                author: {
                    name: "Horigame"
                },
                title: "Commande n°" + commandId,
                description: ":white_check_mark: Votre commande de **1 iron ingot** a été confirmée",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) }
            loginfo = "Commande #" + commandId + " de l'objet " + selection + " effectuée par " + message.author.username + " validée"
            showLog();
        }else{
            if (speakEnglish(message.author)) { message.channel.send({embed: {
                color: 0xff0000,
                author: {
                    name: "Horigame"
                },
                title: "Insufficient balance",
                description: ":no_entry_sign: Your balance isn't sufficient to buy this product.",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) } else { message.channel.send({embed: {
                color: 0xff0000,
                author: {
                    name: "Horigame"
                },
                title: "Solde insuffisant",
                description: ":no_entry_sign: Votre solde n'est pas suffisant pour acheter cet article.",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) }
        }
    }else if (selection == "2") {
        if (irons >= 5) {
            db.push("/game/" + message.author.id + "/objects/irons", irons - 5);
            db.push("/game/" + message.author.id + "/objects/golds", golds + 1);
            function getRandomArbitrary(min, max) {
                return Math.random() * (max - min) + min;
            }
            var commandId = getRandomArbitrary(1000000, 999999999);
            if (speakEnglish(message.author)) { message.channel.send({embed: {
                color: 0x33cc33,
                author: {
                    name: "Horigame"
                },
                title: "Order No. " + commandId,
                description: ":white_check_mark: Your order of **1 gold nugget** was confirmed",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) } else { message.channel.send({embed: {
                color: 0x33cc33,
                author: {
                    name: "Horigame"
                },
                title: "Commande n°" + commandId,
                description: ":white_check_mark: Votre commande de **1 lingot d'or** a été confirmée",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) }
            showLog();
        }else{
            if (speakEnglish(message.author)) { message.channel.send({embed: {
                color: 0xff0000,
                author: {
                    name: "Horigame"
                },
                title: "Insufficient balance",
                description: ":no_entry_sign: Your balance isn't sufficient to buy this product.",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) } else { message.channel.send({embed: {
                color: 0xff0000,
                author: {
                    name: "Horigame"
                },
                title: "Solde insuffisant",
                description: ":no_entry_sign: Votre solde n'est pas suffisant pour acheter cet article.",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) }
        }
    }else if (selection == "3") {
        if (golds >= 5) {
            db.push("/game/" + message.author.id + "/objects/golds", golds - 5);
            db.push("/game/" + message.author.id + "/objects/diamonds", diamonds + 1);
            function getRandomArbitrary(min, max) {
                return Math.random() * (max - min) + min;
            }
            var commandId = getRandomArbitrary(1000000, 999999999);
            if (speakEnglish(message.author)) { message.channel.send({embed: {
                color: 0x33cc33,
                author: {
                    name: "Horigame"
                },
                title: "Order No. " + commandId,
                description: ":white_check_mark: Your order of **1 diamond** was confirmed",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) } else { message.channel.send({embed: {
                color: 0x33cc33,
                author: {
                    name: "Horigame"
                },
                title: "Commande n°" + commandId,
                description: ":white_check_mark: Votre commande de **1 diamant** a été confirmée",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) }
            showLog();
        }else{
            if (speakEnglish(message.author)) { message.channel.send({embed: {
                color: 0xff0000,
                author: {
                    name: "Horigame"
                },
                title: "Insufficient balance",
                description: ":no_entry_sign: Your balance isn't sufficient to buy this product.",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) } else { message.channel.send({embed: {
                color: 0xff0000,
                author: {
                    name: "Horigame"
                },
                title: "Solde insuffisant",
                description: ":no_entry_sign: Votre solde n'est pas suffisant pour acheter cet article.",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) }
        }
    }else if (selection == "4") {
        if (diamonds >= 3) {
            if (message.member.roles.find("id", config.pionnerRoleID)) {
                if (speakEnglish(message.author)) { message.channel.send({embed: {
                color: 0x33cc33,
                author: {
                    name: "Horigame"
                },
                title: "Order No. " + commandId,
                description: ":white_check_mark: Your order of **1 gold nugget** was confirmed",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) } else { message.channel.send({embed: {
                color: 0x33cc33,
                author: {
                    name: "Horigame"
                },
                title: "Commande n°" + commandId,
                description: ":white_check_mark: Votre commande de **1 gold nugget** a été confirmée",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) }
            }else{
            db.push("/game/" + message.author.id + "/objects/golds", diamonds - 3);
            message.member.addRole(config.pionnerRoleID,"A acheté via la Boutique Plug²")
            function getRandomArbitrary(min, max) {
                return Math.random() * (max - min) + min;
            }
            var commandId = getRandomArbitrary(1000000, 999999999);
            if (speakEnglish(message.author)) { message.channel.send({embed: {
                color: 0x33cc33,
                author: {
                    name: "Horigame"
                },
                title: "Order No. " + commandId,
                description: ":white_check_mark: Your order of **Pionner role** was confirmed",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) } else { message.channel.send({embed: {
                color: 0x33cc33,
                author: {
                    name: "Horigame"
                },
                title: "Commande n°" + commandId,
                description: ":white_check_mark: Votre commande de **rôle Pionnier** a été confirmée",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) }
            showLog();
        }}else{
            if (speakEnglish(message.author)) { message.channel.send({embed: {
                color: 0xff0000,
                author: {
                    name: "Horigame"
                },
                title: "Insufficient balance",
                description: ":no_entry_sign: Your balance isn't sufficient to buy this product.",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) } else { message.channel.send({embed: {
                color: 0xff0000,
                author: {
                    name: "Horigame"
                },
                title: "Solde insuffisant",
                description: ":no_entry_sign: Votre solde n'est pas suffisant pour acheter cet article.",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) }
        }
    }else{
        if (speakEnglish(message.author)) { message.channel.send({embed: {
            color: 0xff0000,
            author: {
                name: "Horigame"
            },
            title: "Unavailable Product",
            description: ":no_entry_sign: This product isn't available in " + message.guild.name + " shop.",
            footer: {
                text: "Version " + HorizonVer + " - " + message.author.username
            }
        }}) } else { message.channel.send({embed: {
            color: 0xff0000,
            author: {
                name: "Horigame"
            },
            title: "Produit indisponible",
            description: ":no_entry_sign: Ce produit n'est pas disponible dans la boutique " + message.guild.name + ".",
            footer: {
                text: "Version " + HorizonVer + " - " + message.author.username
            }
        }}) }
}}

function checkGift() {
    let message = lstmsg
    let args = message.content.split(' ');
    args.shift();
    let object = args.join(' ')
    args = object.split(' ');
    args.shift();
    let selection = args.join(' ')
    var golds = db.getData("/game/" + message.author.id + "/objects/golds")
    var irons = db.getData("/game/" + message.author.id + "/objects/irons")
    var woods = db.getData("/game/" + message.author.id + "/objects/woods")
    var setting = uconf.getData("/push/" + message.author.id + "/gifts")
    var xp = db.getData("/game/" + message.author.id + "/xp")
    var invalidUser = false
    try {
        var destUser = message.mentions.users.first().id
        var reciever = message.mentions.users.first()
    } catch(error) {
        lstmsg = message
        invalidUser = true;
    }
    try {
        var testing = db.getData("/game/" + destUser)
    } catch(error) {
        lstmsg = message
        invalidUser = true;
    }
    if (invalidUser === true) {
        giftInvalidUser();
    }
    if (destUser && testing) {
        var givenItself = false;
    if (destUser == message.author.id) {
        lstmsg = message
        giftCannotGiveYourself();
        givenItself = true;
    }
    if (givenItself === false) {
    if (selection.startsWith("1")) {
        if (woods >= 10) {
            db.push("/game/" + message.author.id + "/objects/woods", woods - 10);
            var destWoods = db.getData("/game/" + destUser + "/bonus/woodPack")
            db.push("/game/" + destUser + "/bonus/woodPack", destWoods + 1);
            function getRandomArbitrary(min, max) {
                return Math.random() * (max - min) + min;
            }
            var commandId = getRandomArbitrary(100, 99999);
            if (speakEnglish(message.author)) { message.channel.send({embed: {
                color: 0x33cc33,
                author: {
                    name: "Horigame"
                },
                title: "Donation No. " + commandId,
                description: ":white_check_mark: Your donation of **10 wooden planks** was confirmed",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) } else { message.channel.send({embed: {
                color: 0x33cc33,
                author: {
                    name: "Horigame"
                },
                title: "Don n°" + commandId,
                description: ":white_check_mark: Votre don de **10 planches de bois** a été confirmée",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) }
            // if (setting === true) { if (speakEnglish(message.mentions.users.first())) { message.mentions.users.first().send("🔔 You just received **10 wooden planks** from **" + message.author.username + "**. Use the `=redeem` to redeem that...") } else { message.mentions.users.first().send("🔔 Vous avez reçu un pack de **10 planches de bois** de la part de **" + message.author.username + "**. Utilisez la commande `=redeem` pour les récupérer...") } }
            if (setting === true) { if (speakEnglish(message.mentions.users.first())) { message.mentions.users.first().send({embed: {
                description: "🔔 You recevied a pack of **10 wooden planks** from **" + message.author.username + "**.\nUse `=redeem` to redeem that...",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) } else { message.mentions.users.first().send({embed: {
                description: "🔔 Vous avez reçu un paquet de **10 planches de bois** de la part de **" + message.author.username + "**.\nUtilisez `=redeem` pour les récupérer...",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) } }
            loginfo = "Commande #" + commandId + " de l'objet donation-" + selection + " effectuée par " + message.author.username + " validée"
            showLog();
        }else{
            if (speakEnglish(message.author)) { message.channel.send({embed: {
                color: 0xff0000,
                author: {
                    name: "Horigame"
                },
                title: "Insufficient balance",
                description: ":no_entry_sign: Your balance isn't sufficient to buy this product.",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) } else { message.channel.send({embed: {
                color: 0xff0000,
                author: {
                    name: "Horigame"
                },
                title: "Solde insuffisant",
                description: ":no_entry_sign: Votre solde n'est pas suffisant pour acheter cet article.",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) }
        }}else if (selection.startsWith("2")) {
            if (irons >= 10) {
                db.push("/game/" + message.author.id + "/objects/irons", irons - 10);
                var destIrons = db.getData("/game/" + destUser + "/bonus/ironPack")
                db.push("/game/" + destUser + "/bonus/ironPack", destIrons + 1);
                function getRandomArbitrary(min, max) {
                    return Math.random() * (max - min) + min;
                }
                var commandId = getRandomArbitrary(100, 99999);
                // if (speakEnglish(message.author)) { message.channel.send(":white_check_mark: Your *#" + commandId + "* donation of **10 iron ingots** for **" + message.mentions.users.first().username + "** was done - `" + message.author.username + "`") } else { message.channel.send(":white_check_mark: Votre don *#" + commandId + "* de **10 lingots de fer** pour **" + message.mentions.users.first().username + "** a été validé - `" + message.author.username + "`") }
                if (speakEnglish(message.author)) { message.channel.send({embed: {
                    color: 0x33cc33,
                    author: {
                        name: "Horigame"
                    },
                    title: "Donation No. " + commandId,
                    description: ":white_check_mark: Your donation of **10 iron ingots** was confirmed",
                    footer: {
                        text: "Version " + HorizonVer + " - " + message.author.username
                    }
                }}) } else { message.channel.send({embed: {
                    color: 0x33cc33,
                    author: {
                        name: "Horigame"
                    },
                    title: "Don n°" + commandId,
                    description: ":white_check_mark: Votre don de **10 lingots de fer** a été confirmée",
                    footer: {
                        text: "Version " + HorizonVer + " - " + message.author.username
                    }
                }}) }
                if (setting === true) { if (speakEnglish(message.mentions.user.first())) { message.mentions.users.first().send({embed: {
                description: "🔔 You recevied a pack of **10 wooden planks** from **" + message.author.username + "**.\nUse `=redeem` to redeem that...",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) } else { message.mentions.users.first().send({embed: {
                description: "🔔 Vous avez reçu un paquet de **10 planches de bois** de la part de **" + message.author.username + "**.\nUtilisez `=redeem` pour les récupérer...",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) } }
                
                loginfo = "Commande #" + commandId + " de l'objet donation-" + selection + " effectuée par " + message.author.username + " validée"
                showLog();
            }else{
                if (speakEnglish(message.author)) { message.channel.send({embed: {
                    color: 0xff0000,
                    author: {
                        name: "Horigame"
                    },
                    title: "Insufficient balance",
                    description: ":no_entry_sign: Your balance isn't sufficient to buy this product.",
                    footer: {
                        text: "Version " + HorizonVer + " - " + message.author.username
                    }
                }}) } else { message.channel.send({embed: {
                    color: 0xff0000,
                    author: {
                        name: "Horigame"
                    },
                    title: "Solde insuffisant",
                    description: ":no_entry_sign: Votre solde n'est pas suffisant pour acheter cet article.",
                    footer: {
                        text: "Version " + HorizonVer + " - " + message.author.username
                    }
                }}) }
            }
    }else if (selection.startsWith("3")) {
            if (golds >= 10) {
                db.push("/game/" + message.author.id + "/objects/golds", golds - 10);
                var destGolds = db.getData("/game/" + destUser + "/bonus/goldPack")
                db.push("/game/" + destUser + "/bonus/goldPack", destGolds + 1);
                function getRandomArbitrary(min, max) {
                    return Math.random() * (max - min) + min;
                }
                var commandId = getRandomArbitrary(100, 99999);
                if (speakEnglish(message.author)) { message.channel.send({embed: {
                    color: 0x33cc33,
                    author: {
                        name: "Horigame"
                    },
                    title: "Donation No. " + commandId,
                    description: ":white_check_mark: Your donation of **10 gold ingots** was confirmed",
                    footer: {
                        text: "Version " + HorizonVer + " - " + message.author.username
                    }
                }}) } else { message.channel.send({embed: {
                    color: 0x33cc33,
                    author: {
                        name: "Horigame"
                    },
                    title: "Don n°" + commandId,
                    description: ":white_check_mark: Votre don de **10 pépites d'or** a été confirmée",
                    footer: {
                        text: "Version " + HorizonVer + " - " + message.author.username
                    }
                }}) }
                if (setting === true) { if (speakEnglish(message.mentions.user.first())) { message.mentions.users.first().send({embed: {
                    description: "🔔 You recevied a pack of **10 gold nuggets** from **" + message.author.username + "**.\nUse `=redeem` to redeem that...",
                    footer: {
                        text: "Version " + HorizonVer + " - " + message.author.username
                    }
                }}) } else { message.mentions.users.first().send({embed: {
                    description: "🔔 Vous avez reçu un paquet de **10 pépites d'or** de la part de **" + message.author.username + "**.\nUtilisez `=redeem` pour les récupérer...",
                    footer: {
                        text: "Version " + HorizonVer + " - " + message.author.username
                    }
                }}) } }
                loginfo = "Commande #" + commandId + " de l'objet donation-" + selection + " effectuée par " + message.author.username + " validée"
                showLog();
            }else{
                // if (speakEnglish(message.author)) { message.channel.send(":no_entry: Your current balance (**" + golds + " gold nuggets**) is too low. To donate, you need to have at least **10 gold nuggets**.") } else { message.channel.send(":no_entry: Votre solde actuel (**" + golds + " pépites d'or**) n'est pas suffisant. Pour effectuer un don, vous devez avoir au moins **10 pépites d'or**.") }
                if (speakEnglish(message.author)) { message.channel.send({embed: {
                    color: 0xff0000,
                    author: {
                        name: "Horigame"
                    },
                    title: "Insufficient balance",
                    description: ":no_entry_sign: Your balance isn't sufficient to buy this product.",
                    footer: {
                        text: "Version " + HorizonVer + " - " + message.author.username
                    }
                }}) } else { message.channel.send({embed: {
                    color: 0xff0000,
                    author: {
                        name: "Horigame"
                    },
                    title: "Solde insuffisant",
                    description: ":no_entry_sign: Votre solde n'est pas suffisant pour acheter cet article.",
                    footer: {
                        text: "Version " + HorizonVer + " - " + message.author.username
                    }
                }}) }
            }
    }else if (selection.startsWith("4")) {
        if (xp >= 10) {
            db.push("/game/" + message.author.id + "/xp", xp - 10);
            var destXp = db.getData("/game/" + destUser + "/bonus/xpBottle")
            db.push("/game/" + destUser + "/bonus/xpBottle", destXp + 1);
            function getRandomArbitrary(min, max) {
                return Math.random() * (max - min) + min;
            }
            var commandId = getRandomArbitrary(100, 99999);
            // if (speakEnglish(message.author)) { message.channel.send(":white_check_mark: Your *#" + commandId + "* donation of **10 XP points** for **" + message.mentions.users.first().username + "** was done - `" + message.author.username + "`") } else { message.channel.send(":white_check_mark: Votre don *#" + commandId + "* de **10 points d'expérience** pour **" + message.mentions.users.first().username + "** a été validé - `" + message.author.username + "`") }
            if (speakEnglish(message.author)) { message.channel.send({embed: {
                color: 0x33cc33,
                author: {
                    name: "Horigame"
                },
                title: "Donation No. " + commandId,
                description: ":white_check_mark: Your donation of **10 XP points** was confirmed",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) } else { message.channel.send({embed: {
                color: 0x33cc33,
                author: {
                    name: "Horigame"
                },
                title: "Don n°" + commandId,
                description: ":white_check_mark: Votre don de **10 points d'expérience** a été confirmée",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) }
            try { var setting = db.getData('/game/' + message.mentions.users.first().id + '/push/gifts') } catch(err) { var setting = true }
            if (setting === true) { if (speakEnglish(message.mentions.user.first())) { message.mentions.users.first().send({embed: {
                description: "🔔 You recevied a pack of **10 XP points** from **" + message.author.username + "**.\nUse `=redeem` to redeem that...",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) } else { message.mentions.users.first().send({embed: {
                description: "🔔 Vous avez reçu un paquet de **10 points d'expérience** de la part de **" + message.author.username + "**.\nUtilisez `=redeem` pour les récupérer...",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) } }
            loginfo = "Commande #" + commandId + " de l'objet donation-" + selection + " effectuée par " + message.author.username + " validée"
            showLog();
        }else{
            // if (speakEnglish(message.author)) { message.channel.send(":no_entry: Your current XP for this level (**" + xp + "/500**) is too low. To donate, you need to have at least **10/500**.") } else { message.channel.send(":no_entry: Votre expérience dans le niveau actuel actuel (**" + xp + "/500**) n'est pas suffisant. Pour effectuer un don, vous devez avoir au moins **10/500**.") }
            if (speakEnglish(message.author)) { message.channel.send({embed: {
                color: 0xff0000,
                author: {
                    name: "Horigame"
                },
                title: "Insufficient balance",
                description: ":no_entry_sign: Your balance isn't sufficient to buy this product.",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) } else { message.channel.send({embed: {
                color: 0xff0000,
                author: {
                    name: "Horigame"
                },
                title: "Solde insuffisant",
                description: ":no_entry_sign: Votre solde n'est pas suffisant pour acheter cet article.",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) }
        }}else{
            // if (speakEnglish(message.author)) { message.channel.send(":no_entry: Specified donation element cannot be found. Check spelling and retry... - `" + message.author.username + "`") } else { message.channel.send(":no_entry: L'élément de don avec l'identifiant spécifié est introuvable. Vérifiez l'orthographe et réessayez... - `" + message.author.username + "`") }
            if (speakEnglish(message.author)) { message.channel.send({embed: {
                color: 0xff0000,
                author: {
                    name: "Horigame"
                },
                title: "Invalid ID",
                description: ":no_entry_sign: The requested gift ID is invalid.",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) } else { message.channel.send({embed: {
                color: 0xff0000,
                author: {
                    name: "Horigame"
                },
                title: "Identifiant invalide",
                description: ":no_entry_sign: L'identifiant cadeau donné est invalide.",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }}) }
        }
}}}

function giftInvalidUser() {
    message = lstmsg
    var destUser
    try {
    destUser = message.mentions.users.first().username
    } catch(error) {}
    if (destUser) {
        if (speakEnglish(message.author)) { message.channel.send({embed: {
            color: 0xff0000,
            author: {
                name: "Horigame"
            },
            title: "No profile",
            description: ":no_entry_sign: This user don't have created its profile.",
            footer: {
                text: "Version " + HorizonVer + " - " + message.author.username
            }
        }}) } else { message.channel.send({embed: {
            color: 0xff0000,
            author: {
                name: "Horigame"
            },
            title: "Pas de profil",
            description: ":no_entry_sign: Cet utilisateur n'a pas encore créé son profil.",
            footer: {
                text: "Version " + HorizonVer + " - " + message.author.username
            }
        }}) }
    } else {
        if (speakEnglish(message.author)) { message.channel.send({embed: {
            color: 0xff0000,
            author: {
                name: "Horigame"
            },
            title: "User not found",
            description: ":no_entry_sign: The requested user wasn't found.",
            footer: {
                text: "Version " + HorizonVer + " - " + message.author.username
            }
        }}) } else { message.channel.send({embed: {
            color: 0xff0000,
            author: {
                name: "Horigame"
            },
            title: "Utilisateur introuvable",
            description: ":no_entry_sign: L'utilisateur spécifié est introuvable.",
            footer: {
                text: "Version " + HorizonVer + " - " + message.author.username
            }
        }}) }
    }
}

function giftCannotGiveYourself() {
    message = lstmsg
    // if (speakEnglish(message.author)) { message.channel.send(":no_entry: You cannot donate to yourself") } else { message.channel.send(":no_entry: Vous ne pouvez pas vous faire de don à vous même") }
    if (speakEnglish(message.author)) { message.channel.send({embed: {
        color: 0xff0000,
        author: {
            name: "Horigame"
        },
        description: ":no_entry_sign: You cannot donate to yourself.",
        footer: {
            text: "Version " + HorizonVer + " - " + message.author.username
        }
    }}) } else { message.channel.send({embed: {
        color: 0xff0000,
        author: {
            name: "Horigame"
        },
        description: ":no_entry_sign: Vous ne pouvez pas faire de don à vous même.",
        footer: {
            text: "Version " + HorizonVer + " - " + message.author.username
        }
    }}) }
}

function speakEnglish(member) {
    try {
        var langconf = uconf.getData('/lang/' + member.id)
    } catch (err) {
        var langconf = "fr";
    }
    if (langconf == 'en') { return true; } else { return false; }
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
    console.log(time + " [" + shard.id + "] : " + loginfo)
    fs.appendFile("horigame.log", "\n" + time + " [" + shard.id + "] : " + loginfo, (error) => { /* handle error */ })
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
        console.log("[Horigame] [" + shard.id + "] " + time + " : " + loginfo)
}}

function pinpages(message) {
    if (message.content == "=pinpages") {
        if (speakEnglish(message.author)) { message.channel.send({embed: {
            color: 0xbc3af1,
            author: {
                name: "PinPages",
                avatar: "https://pinpages.alwaysdata.net/resources/image/logo.png"
            },
            description: ":no_entry_sign: PinPages integration isn't ready for now",
            footer: {
                text: "Horizon Version " + HorizonVer + " - " + message.author.username
            }
        }}) } else { message.channel.send({embed: {
            color: 0xbc3af1,
            author: {
                name: "PinPages",
                avatar: "https://pinpages.alwaysdata.net/resources/image/logo.png"
            },
            description: ":no_entry_sign: L'intégration PinPages n'est pour l'instant pas encore prête",
            footer: {
                text: "Horizon Version " + HorizonVer + " - " + message.author.username
            }
        }}) }
    } else if (message.contents.startsWith("=pinpages ")) {
        command = message.content.replace("=pinpages ","")
    }
}
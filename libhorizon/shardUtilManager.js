// Client de Sharding 

const Discord = require('discord.js');
var config = require('../config/config.json')
const Manager = new Discord.ShardingManager('./libhorizon/clientRuntime.js');
Manager.spawn(config.shardQty);
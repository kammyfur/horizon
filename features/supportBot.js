const dialogflow = require('dialogflow');
const uuid = require('uuid');

var oldmessage
var oldmessage2

async function askBot(text) {
    projectId = 'supportminteckprojects-rqawev'
    const sessionId = uuid.v4();
  
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);
  
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: text,
          languageCode: 'fr',
        },
      },
    };
  
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    return result.fulfillmentText;
  }

module.exports.check = async function (message) {
    if (message.author.id == "546770319575089175" || message.author.id == "546770610513248257" || (message.author.id == "294910706250285056" && message.content.startsWith("-"))) {
        return
    }
    if (message.channel.id == "589858499987636409" || message.channel.id == "579410705850040336") {
        if (message.content.startsWith("=") || message.content.startsWith(">")) {
            message.delete()
            message.channel.send({embed: {
                color: 0xffcc00,
                description: ":warning: Les commandes d'Horizon ne peuvent pas fonctionner dans ce salon.",
                footer: {
                    text: "Version " + HorizonVer + " - " + message.author.username
                }
            }})
        } else {
            oldmessage = message.content
            oldmessage2 = message.author.username
            message.channel.send({embed: {
                color: 0x33cc33,
                description: "...",
                footer: {
                    text: "Support Bot " + SupportVer + " - " + message.author.username
                }
            }}).then(async function (message) {
                text = await askBot(oldmessage)
            if (message.guild.id == "575389787737817099") {
                text = text.replace("<#408350553714720769>","<#575404092025995285>")
            }
            message.edit({embed: {
                color: 0x33cc33,
                description: text,
                footer: {
                    text: "Support Bot " + SupportVer + " - " + oldmessage2
                }
            }})
            })
        }
    }
}
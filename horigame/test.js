const translate = require('@vitalets/google-translate-api');
translate("Bonjour", {from: 'fr', to: 'en'}).then(res => {
    console.log(res.text)
}).catch(err => {
    console.error(err);
});
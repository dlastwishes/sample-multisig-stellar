var StellarSdk = require('stellar-sdk');
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

server.accounts().accountId("GDMK4H565AU6HGK4JMHICECYSP2NIYGUC2BXIUIRFQ4LAYPGKEHUEWWT").call().then(function (accountResult) {
    console.log(accountResult);
  }).catch(function (err) {
    console.error(err);
  })
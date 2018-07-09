var StellarSdk = require('stellar-sdk');

var request = require('request');
var pair = StellarSdk.Keypair.random();

request.get({
  url: 'https://friendbot.stellar.org',
  qs: { addr: pair.publicKey() },
  json: true
}
, function(error, response, body) {
  if (error || response.statusCode !== 200) {
    console.error('ERROR!', error || body);
  }
  else {
    console.log('success account and fund in lumens', body);
  }
});



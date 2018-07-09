var StellarSdk = require('stellar-sdk');

StellarSdk.Network.useTestNetwork();

var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

var sourceKeys = StellarSdk.Keypair.fromSecret('SDBQFYPK4O5AGX42ZPVLXVYHSMYJRAQH6T5FVXXQVZ3M3OMLW6SEQ5WU');


var destinationId = 'GDMK4H565AU6HGK4JMHICECYSP2NIYGUC2BXIUIRFQ4LAYPGKEHUEWWT';


var transaction;

 server.loadAccount(destinationId).catch(StellarSdk.NotFoundError, function (error) {
   throw new Error('The destination account does not exist!');
 })

 .then(function() {
   return server.loadAccount(sourceKeys.publicKey());
 })

 .then(function(sourceAccount) {

   transaction = new StellarSdk.TransactionBuilder(sourceAccount)
     .addOperation(StellarSdk.Operation.payment({
       destination: destinationId,
       asset: StellarSdk.Asset.native(),
       amount: "10"
     })).addMemo(StellarSdk.Memo.text('Test TX by dlastwishes')).build();

   transaction.sign(sourceKeys);

   return server.submitTransaction(transaction);
 })

 .then(function(result) {

   console.log('Submit Transaction Success', result);
 })

 .catch(function(error) {
   console.error('Error', error);

 });
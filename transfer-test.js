var StellarSdk = require('stellar-sdk');

StellarSdk.Network.useTestNetwork();

var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

var sourceKeys = StellarSdk.Keypair.fromSecret('SA47Q3XQNDZERCMGLM3O4PICLFUHYIJMPQXYHO3QZV27XBVQ3MADPDTF');


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
       amount: "100"
     })).addMemo(StellarSdk.Memo.text('Test TX by d')).build();

 transaction.sign(sourceKeys);

   return server.submitTransaction(transaction);
 })

 .then(function(result) {

   console.log('Submit Transaction Success', result);
 })

 .catch(function(error) {
   console.error('Error', error);

 });
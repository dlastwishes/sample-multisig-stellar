var StellarSdk = require('stellar-sdk');
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
StellarSdk.Network.useTestNetwork();


var rootKeypair = StellarSdk.Keypair.fromSecret("SDBQFYPK4O5AGX42ZPVLXVYHSMYJRAQH6T5FVXXQVZ3M3OMLW6SEQ5WU")
var account = new StellarSdk.Account(rootKeypair.publicKey(), "41423374726987780");

var secondaryAddress = "GDMK4H565AU6HGK4JMHICECYSP2NIYGUC2BXIUIRFQ4LAYPGKEHUEWWT";

var transaction = new StellarSdk.TransactionBuilder(account)
  .addOperation(StellarSdk.Operation.setOptions({
    signer: {
      ed25519PublicKey: secondaryAddress,
      weight: 1
    }
  }))
  .addOperation(StellarSdk.Operation.setOptions({
    masterWeight: 0, 
    lowThreshold: 2,
    medThreshold: 2, 
    highThreshold: 2 
  }))
  .build();

transaction.sign(rootKeypair); // only need to sign with the root signer as the 2nd signer won't be added to the account till after this transaction completes

return server.submitTransaction(transaction);



console.log("multisig success");
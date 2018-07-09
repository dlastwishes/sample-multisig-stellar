var StellarSdk = require('stellar-sdk');
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
StellarSdk.Network.useTestNetwork();

var rootKeypair = StellarSdk.Keypair.fromSecret("SDBQFYPK4O5AGX42ZPVLXVYHSMYJRAQH6T5FVXXQVZ3M3OMLW6SEQ5WU")
var account = server.loadAccount(rootKeypair.publicKey());

var transaction = new StellarSdk.TransactionBuilder(account)
    .addOperation(StellarSdk.Operation.payment({
        destination: "GDMK4H565AU6HGK4JMHICECYSP2NIYGUC2BXIUIRFQ4LAYPGKEHUEWWT",
        asset: StellarSdk.Asset.native(),
        amount: "20" 
    }))
    .build();

var secondKeypair = StellarSdk.Keypair.fromSecret("SBYR5CVHC65ONCW7VBSCTQKKFK5MIDCR3HHZDACXW2MDZDPLRY3HEJZF");

transaction.sign(rootKeypair);
transaction.sign(secondKeypair);

return server.submitTransaction(transaction);


console.log("transfer multisig is success");
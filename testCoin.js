const StellarSdk = require('stellar-sdk')

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org')
StellarSdk.Network.useTestNetwork()

const masterKey = StellarSdk.Keypair.fromSecret("SDFPR5PYKLAK7MTXAZ5IW2SSGQSKVE6DO6IHHBWCRHEF4CKSJLW5DQVB")

const escrow = StellarSdk.Keypair.fromSecret(StellarSdk.Keypair.random().secret())
const owner = StellarSdk.Keypair.fromSecret(StellarSdk.Keypair.random().secret())
const ngo = StellarSdk.Keypair.fromSecret(StellarSdk.Keypair.random().secret())
const issuer = StellarSdk.Keypair.fromSecret(StellarSdk.Keypair.random().secret())

const newAsset = new StellarSdk.Asset("testCoin", issuer.publicKey())

main()

async function setFundAccount(to) {
    const fromAcc = await server.loadAccount(masterKey.publicKey())
    const transaction = new StellarSdk.TransactionBuilder(fromAcc)
    .addOperation(StellarSdk.Operation.payment({
      destination: to.publicKey(),
      asset: StellarSdk.Asset.native(),
      amount : "100"
    }))
    .build()
  transaction.sign(masterKey)
  return server.submitTransaction(transaction)
}

async function main () {
  try {
    await setFundAccount(owner);
    await setFundAccount(ngo);
    await setFundAccount(issuer);
    await setFundAccount(escrow);

    await changeEscrowTrust()
    await issuingToken()
    console.log('Success!')
  } catch (error) {
    console.log('error = ', error.message, JSON.stringify(error.stack, null, 4))
  }
}

async function changeEscrowTrust () {
  console.log('Changing escrow trust')
  const escrowAccount = await server.loadAccount(escrow.publicKey())
  const transaction = new StellarSdk.TransactionBuilder(escrowAccount)
    .addOperation(StellarSdk.Operation.changeTrust({
      asset: newAsset
    }))
    .build()
  transaction.sign(owner)
  transaction.sign(ngo)
  return server.submitTransaction(transaction)
}

async function issuingToken () {
  console.log('Issuing token')
  const issuerAccount = await server.loadAccount(issuer.publicKey())
  const transaction = new StellarSdk.TransactionBuilder(issuerAccount)
    .addOperation(StellarSdk.Operation.payment({
      destination: escrow.publicKey(),
      asset: newAsset,
      amount: "1000"
    }))
    .build()
  transaction.sign(issuer)
  return server.submitTransaction(transaction)
}
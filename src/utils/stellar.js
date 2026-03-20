import * as StellarSdk from 'stellar-sdk';

const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

const server = new StellarSdk.Horizon.Server(HORIZON_URL);

/**
 * Fetch the XLM balance for a given public key on the Testnet.
 */
export async function getBalance(publicKey) {
  try {
    const account = await server.loadAccount(publicKey);
    const xlmBalance = account.balances.find(b => b.asset_type === 'native');
    return xlmBalance ? parseFloat(xlmBalance.balance).toFixed(2) : '0.00';
  } catch (err) {
    if (err?.response?.status === 404) {
      return '0.00'; // Account not yet funded
    }
    throw err;
  }
}

/**
 * Fund a new Testnet account via Friendbot.
 */
export async function fundWithFriendbot(publicKey) {
  const resp = await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
  if (!resp.ok) throw new Error('Friendbot funding failed');
  return await resp.json();
}

/**
 * Send 10 XLM from the master wallet to the destination address on Testnet.
 *
 * ⚠️  The secret key is loaded from VITE_MASTER_SECRET (.env).
 *     This is ONLY acceptable for Testnet/MVP.
 *     For production, move signing to a server-side function.
 */
export async function sendXLM(destinationPublicKey) {
  const masterSecret = import.meta.env.VITE_MASTER_SECRET;

  if (!masterSecret) {
    throw new Error(
      'VITE_MASTER_SECRET not set. Please add it to your .env file.'
    );
  }

  let masterKeypair;
  try {
    masterKeypair = StellarSdk.Keypair.fromSecret(masterSecret);
  } catch {
    throw new Error('Invalid master secret key in VITE_MASTER_SECRET.');
  }

  const masterPublicKey = masterKeypair.publicKey();

  // Load master account from Horizon
  const masterAccount = await server.loadAccount(masterPublicKey);

  // Build the transaction
  const transaction = new StellarSdk.TransactionBuilder(masterAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: destinationPublicKey,
        asset: StellarSdk.Asset.native(),
        amount: '10',
      })
    )
    .addMemo(StellarSdk.Memo.text('Stellar Speed-Run 🚀'))
    .setTimeout(30)
    .build();

  // Sign with master keypair
  transaction.sign(masterKeypair);

  // Submit to Testnet Horizon
  const result = await server.submitTransaction(transaction);

  return {
    success: true,
    txHash: result.hash,
  };
}

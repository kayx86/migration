import express from 'express';
import { setPhantomPublicKey, setDappSecret, setSession, setSuccessTransaction , getPhantomPublicKey , getDappSecret , getSharedSecret , getPhantomWalletPublicKey , getSession , getSuccessTransaction} from '../utils/types';
import { decodeSecretKey, createSharedSecret, decryptPayload } from '../utils/encryptionUtils';
import { handleTransaction } from '../utils/transactionHandler';
import { launchBot } from '../bot/bot';

const app = express();
const PORT = 3000;

app.get("/callback", async (req, res) => {
  const { phantom_encryption_public_key, nonce, data, dapp_encryption_secret_key } = req.query;
  
  if (typeof dapp_encryption_secret_key === 'string' && typeof phantom_encryption_public_key === 'string' &&
      typeof nonce === 'string' && typeof data === 'string') {
    
    setDappSecret(dapp_encryption_secret_key);
    setPhantomPublicKey(phantom_encryption_public_key);
    
    const dappKeyPair = decodeSecretKey(dapp_encryption_secret_key);
    const sharedSecretDapp = createSharedSecret(phantom_encryption_public_key, dappKeyPair.secretKey);
    
    const connectData = await decryptPayload(data, nonce, sharedSecretDapp);
    
    setSession(connectData.session);
    console.log(connectData.session);
  }
  res.redirect("tg://resolve?domain=testing_polyquest_bot");
});

app.get("/success", async (req, res) => {
  setSuccessTransaction("True");
  
  const { data, nonce } = req.query;
  const handler_2 = getPhantomWalletPublicKey()
  const handler = getDappSecret()
  if (typeof getDappSecret() === 'string' && typeof nonce === 'string' && typeof data === 'string' &&
      typeof getPhantomWalletPublicKey() === 'string') {

    if (handler && handler_2)
    {

        const dappKeyPair = decodeSecretKey(handler);
        const sharedSecretDapp = createSharedSecret(handler_2, dappKeyPair.secretKey);
        
        const connectData = await decryptPayload(data, nonce, sharedSecretDapp);
        await handleTransaction(connectData);
    }
  }
  
  res.redirect("tg://resolve?domain=testing_polyquest_bot");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  launchBot();
});


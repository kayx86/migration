// encryptionUtils.ts
import bs58 from 'bs58';
import nacl from 'tweetnacl';

export const decodeSecretKey = (key: string) => {
  return nacl.box.keyPair.fromSecretKey(bs58.decode(key));
};

export const createSharedSecret = (phantomKey: string, dappSecretKey: Uint8Array) => {
  return nacl.box.before(bs58.decode(phantomKey), dappSecretKey);
};

export const decryptPayload = async (data: string, nonce: string, sharedSecret: Uint8Array) => {
    if (!sharedSecret) throw new Error("Missing shared secret");
  
    try {
        
        const decodedData = bs58.decode(data);
        const decodedNonce = bs58.decode(nonce);
        const decryptedData = nacl.box.open.after(decodedData, decodedNonce, sharedSecret);
  
        if (!decryptedData) {
            console.error("Decryption failed. Data or nonce might be incorrect.");
            throw new Error("Unable to decrypt data");
        }
  
      return JSON.parse(Buffer.from(decryptedData).toString("utf8"));
    } catch (error) {
        console.error("An error occurred during decryption:", error);
        throw new Error("Failed to decrypt payload");
    }
};
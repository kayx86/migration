export let phantomPubicKeyEncryp: string | undefined;
export let dappSecret: string | undefined;
export let sharedSecret: Uint8Array | undefined;
export let phantomWalletPublicKey: string | undefined;
export let session: string | undefined;
export let successTransaction: string | undefined;
export const useUniversalLinks = true;

// Setter functions
export const setPhantomPublicKey = (key: string) => { phantomPubicKeyEncryp = key; };
export const setDappSecret = (key: string) => { dappSecret = key; };
export const setSharedSecret = (secret: Uint8Array) => { sharedSecret = secret; };
export const setPhantomWalletPublicKey = (key: string) => { phantomWalletPublicKey = key; };
export const setSession = (sess: string) => { session = sess; };
export const setSuccessTransaction = (status: string) => { successTransaction = status; };

// Getter functions
export const getPhantomPublicKey = (): string | undefined => phantomPubicKeyEncryp;
export const getDappSecret = (): string | undefined => dappSecret;
export const getSharedSecret = (): Uint8Array | undefined => sharedSecret;
export const getPhantomWalletPublicKey = (): string | undefined => phantomWalletPublicKey;
export const getSession = (): string | undefined => session;
export const getSuccessTransaction = (): string | undefined => successTransaction;

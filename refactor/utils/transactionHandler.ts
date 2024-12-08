import { Transaction } from '@solana/web3.js';
import base58 from 'bs58';

export const handleTransaction = async (connectData: any) => {
  const transaction: Transaction = Transaction.from(base58.decode(connectData.transaction));
  const dataVoting = {
    data: {
      bettingId: ,
      signedTx: transaction.serialize().toString('base64'),
    }
  };

  return fetch("https://devnet.polyquest.xyz/api/actions/bettings/sol/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataVoting),
  });
};
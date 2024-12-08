import { PublicKey, Transaction, SendOptions } from '@solana/web3.js';

type DisplayEncoding = 'utf8' | 'hex';

type PhantomEvent = 'connect' | 'disconnect' | 'accountChanged';

type PhantomRequestMethod =
  | 'connect'
  | 'disconnect'
  | 'signAndSendTransaction'
  | 'signTransaction'
  | 'signAllTransactions'
  | 'signMessage';

interface ConnectOpts {
  onlyIfTrusted: boolean;
}

export interface PhantomProvider {
  publicKey: PublicKey | null;
  isConnected: boolean | null;
  signAndSendTransaction: (
    transaction: Transaction,
    opts?: SendOptions
  ) => Promise<{ signature: string; publicKey: PublicKey }>;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  signMessage: (message: Uint8Array | string, display?: DisplayEncoding) => Promise<any>;
  connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, handler: (args: any) => void) => void;
  request: (method: PhantomRequestMethod, params: any) => Promise<unknown>;
}

export type Status = 'success' | 'warning' | 'error' | 'info';

export type Quest = {
  id: number;
  title: string;
  description: string;
  relevantLink: string;
  creatorFeePercent: number;
  serviceFeePercent: number;
  startDate: string;
  endDate: string;
  creatorAddress: string;
  tokenId: number;
  categoryId: number | null;
  adjournDate: string | null;
  adjournTx: string | null;
  adjournReason: string | null;
  approveDate: string;
  approveTx: string;
  finishDate: string;
  finishTx: string;
  answerTx: string;
  draftTime: string;
  draftTx: string;
  imageUrl: string;
  finalAnswerId: number | null;
  totalAmount: number;
  voteCount: number;
  minBetAmount: number;
  successTx: string | null;
  successTime: string | null;
  hot: boolean;
  hidden: boolean;
  active: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  answers: Array<{ title: string; percent: number; totalAmount: number; id: number }>;
  category: any | null;
  token: {
    id: number;
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    imageUrl: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

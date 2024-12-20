import express, { Request, Response } from 'express';
const CLUSTER = "mainnet-beta";
const REDIRECT_HOST =
  "https://kayx86.com";
import { Context, Telegraf , Markup } from 'telegraf';
import { message } from 'telegraf/filters'
import { Update , InlineKeyboardButton } from '@telegraf/types';
import * as dotenv from 'dotenv';
import { Handler } from './lib/actions';
import nacl from 'tweetnacl';
import bodyParser from 'body-parser';
import { Transaction } from '@solana/web3.js';
import bs58 from "bs58";
import { Buffer } from "buffer";
import base58 from 'bs58';

dotenv.config();
const app = express();
const PORT: number = 3000;
app.use(bodyParser.json());
const dappKeyPair = nacl.box.keyPair();
let sharedSecret: Uint8Array | undefined;
let session: string | undefined;
let phantomWalletPublicKey: string | undefined;
let successTransaction: string | undefined;
let dapp_serecet: string | undefined
let phantomPubicKeyEncryp: string | undefined
let bettingID: number | undefined
let tx: string;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.get("/callback", async (req, res) => {
  const { dapp_encryption_secret_key , nonce, data } = req.query;
  if (typeof dapp_encryption_secret_key === 'string' && typeof nonce === 'string' && typeof data === 'string' ) {
    const [baseUrl, queryString] = dapp_encryption_secret_key.split('?');

    const params = new URLSearchParams(queryString);
    console.log(params)
    console.log(baseUrl)
    const walletEncryptionKey = params.get('wallet_encryption_public_key');

    params.delete('wallet_encryption_public_key');
    const newQueryString = params.toString();
    const dapp_pub_key = baseUrl + (newQueryString ? `?${newQueryString}` : '');
  
    const dappSecretKey = bs58.decode(dapp_pub_key);
    const dappKeyPair = nacl.box.keyPair.fromSecretKey(dappSecretKey);
    if (walletEncryptionKey) {
      const sharedSecretDapp = nacl.box.before(
        bs58.decode(walletEncryptionKey),
        dappKeyPair.secretKey
    );
  
    const connectData = await decryptPayload(data, nonce, sharedSecretDapp);
    const databack = {
      public_key: connectData.public_key.toString(),
      session: connectData.session,
    };
    phantomWalletPublicKey = databack.public_key
    console.log("Day la session")
    session = connectData.session
    console.log(connectData.session)
    sharedSecret = nacl.box.before(
      bs58.decode(walletEncryptionKey),
      dappKeyPair.secretKey
    );
    }
  }
  res.redirect("https://t.me/testing_polyquest_bot");
});
app.get("/success",  async (req, res) => {
  successTransaction = "True";
  const { data , nonce } = req.query
  console.log(data)
  console.log(bettingID)
  if (typeof nonce === 'string' && typeof data === 'string' ) { 
    if(sharedSecret) {
      const connectData = await decryptPayload(data, nonce, sharedSecret);
      tx = connectData.transaction
    }  
  }
  await new Promise(resolve => setTimeout(resolve, 1500));

  res.redirect("https://t.me/testing_polyquest_bot");
  successTransaction = "False"
})

const decryptPayload = (data: string, nonce: string, sharedSecret: Uint8Array) => {
  if (!sharedSecret) throw new Error("Missing shared secret");
  
  try {
      // Decode data and nonce from base58 strings
      const decodedData = bs58.decode(data);
      const decodedNonce = bs58.decode(nonce);

      console.log('sharedSecret:', sharedSecret);
      console.log('decoded data:', decodedData);
      console.log('decoded nonce:', decodedNonce);

      // Attempt to decrypt the data
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
const useUniversalLinks = true;
const userConnections = new Map<number, boolean>();
dotenv.config();
const bot: Telegraf<Context<Update>> = new Telegraf(
  "8037096194:AAEBXLMPksuw-h0eN6JdHrKI8YajbByQL0A",
  {
    telegram: {
      apiRoot: "https://api.telegram.org",
      agent: undefined,
      webhookReply: true,
    },
  }
);

setTimeout(() => {
  bot.telegram.callApi("getMe", {});
}, 30000);



const addLog = (log: string) => {
  console.log("> " + log);
};

const buildUrl = (path: string, params: URLSearchParams) =>
  `${
    useUniversalLinks ? "https://backpack.app/ul/" : "phantom://"
  }v1/${path}?${params.toString()}`;

const encryptPayload = (payload: any) => {
  
  if (sharedSecret === undefined)
    throw new Error("missing or invalid shared secret");

  const nonce = nacl.randomBytes(24);

  const encryptedPayload = nacl.box.after(
    Buffer.from(JSON.stringify(payload)),
    nonce,
    sharedSecret
  );

  return [nonce, encryptedPayload];
};


const connect = async (): Promise<string> => {
  const dappEncryptionSecretKey = bs58.encode(dappKeyPair.secretKey);
  const redirectLink = `https://kayx86.com/callback?dapp_encryption_secret_key=${dappEncryptionSecretKey}`;

  const params = new URLSearchParams({
    dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
    cluster: CLUSTER,
    app_url: "https://t.me/devlifebot",
    redirect_link: redirectLink,
  });
  console.log(bs58.encode(dappKeyPair.publicKey))
  console.log("params: ", params);
  const url = buildUrl("connect", params);
  console.log("url: ", url);
  addLog(`Generated URL: ${url}`);
  return url;
};

const signTransaction = async (amount: number) => {
  console.log(phantomWalletPublicKey)
  const url = 'https://polyquest.xyz/api/actions/bettings/sol'; 
  const payload = {
      account: phantomWalletPublicKey,
      data: {
          questId: 275,
          answerId: 574,
          amount: 0.009
      }
  };

  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      const transactionBuffer = Buffer.from(data.encodedTx, "base64");
      const serializedTransaction = bs58.encode(transactionBuffer);
      if (session === undefined) throw new Error("missing or invalid session");
      const payloadReturn = {
        session,
        transaction: serializedTransaction,
      };
      const redirectLink = encodeURI(`https://kayx86.com/success`);
    
      console.log("redirectLink", redirectLink);
      bettingID =  data.betting.id
      const [nonce, encryptedPayload] = encryptPayload(payloadReturn);
      const params = new URLSearchParams({
        dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
        nonce: bs58.encode(nonce),
        payload: bs58.encode(encryptedPayload),
        redirect_link: redirectLink,
      });
      const urlReturn = buildUrl("signTransaction", params);
      return urlReturn;
  } catch (error) {
      console.error('Fetch error:', error);
      return null;
  }
};
const eligibleUsers = ["kayx86", "david_in_web3", "jameskim_cp"];

bot.command('claim', async (ctx) => {
  try {
    await ctx.reply("Check to see if you are eligible for this month's quest reward", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Check Claim",
              callback_data: "check_claim", 
            },
          ],
        ],
      },
    });
  } catch (error) {
    console.error(error);
    await ctx.reply("An error occurred. Please try again later.");
  }
});
bot.action('check_claim', async (ctx) => {
  try {
    const username = ctx.from?.username;

    if (!username) {
      await ctx.editMessageText(
        "We could not detect your username. Please ensure you have set a Telegram username."
      );
      return;
    }
    const token = "$BONK"
    if (eligibleUsers.includes(username)) {
      await ctx.editMessageText(
        `Congratulations, ${username}! You are eligible to claim 500 ${token}.`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Claim", // Update button text to "Claim"
                  callback_data: "perform_claim", // New callback for claiming
                },
              ],
            ],
          },
        }
      );
    } else {
      await ctx.editMessageText(
        `Sorry, ${username}. You are not eligible to claim.`
      );
    }
  } catch (error) {
    console.error(error);
    await ctx.reply("An error occurred while updating the button. Please try again later.");
  }
});

// Handle the claim action and confirm the claim
bot.action('perform_claim', async (ctx) => {
  try {
    // Lấy username hoặc tên người dùng
    const username = ctx.from?.username ? `@${ctx.from.username}` : ctx.from?.first_name || "user";

    // Chỉnh sửa nội dung tin nhắn gốc
    await ctx.editMessageText(`🎉 Congratulations, ${username}! Your claim has been confirmed. Thank you!`);
  } catch (error) {
    console.error(error);
    // Gửi thông báo lỗi nếu có vấn đề
    await ctx.reply("An error occurred while confirming your claim. Please try again later.");
  }
});

bot.on(message('text'), async (ctx) => {
  const messageText = ctx.message.text;
  if (messageText.startsWith("/getquest")) {
    const userId = ctx.from.id;
    const data = await Handler()
    if (!userConnections.has(userId)) {
      if (data) {
        const url = await connect();
        const title = data?.title;
            const description = data?.description;
            const imageUrl = data?.imageUrl;
            const answers = data?.answers;
            const totalAmountQuest = data?.totalAmount;
            const token = data?.token;
            const tokenSymbol = token.symbol;
            const tokenDecimals = token.decimals;
    
            const totalAmount = answers.reduce((sum, answer) => sum + answer.totalAmount, 0) / (10 ** tokenDecimals);
    
            const answersDescription = answers.map(answer => 
              `${answer.title} : ${(answer.percent * 100).toFixed(1)}% (${answer.totalAmount} ${tokenSymbol})`
            ).join('\n');
    
            const caption = `${title}\n\nPredicted so far: ${totalAmountQuest} ${tokenSymbol}\n\n${answersDescription}`;
        var msg = await ctx.replyWithPhoto(
          { url: data?.imageUrl },
          {
            caption: caption,
            parse_mode: "Markdown",
            ...Markup.inlineKeyboard([
              Markup.button.url("Please connect Backpack Wallet", url),
            ]),
          }
        );
      }
      if (data) {
        const checkConnection = async () => {
          if (phantomWalletPublicKey) { 
            const inlineKeyboard: InlineKeyboardButton[][] = []; 

            for (let index_anser = 0; index_anser < data.answers.length; index_anser++) {
              const action = data.answers[index_anser];
              const url = await signTransaction(1);
              
              if (url) {
                const button = Markup.button.url(action.title, url);
                inlineKeyboard.push([button]); 
              }
            }
            
            const title = data?.title;
            const description = data?.description;
            const imageUrl = data?.imageUrl;
            const answers = data?.answers;
            const totalAmountQuest = data?.totalAmount;
            const token = data?.token;
            const tokenSymbol = token.symbol;
            const tokenDecimals = token.decimals;
    
            const totalAmount = answers.reduce((sum, answer) => sum + answer.totalAmount, 0) / (10 ** tokenDecimals);
    
            const answersDescription = answers.map(answer => 
              `${answer.title} : ${(answer.percent * 100).toFixed(1)}% (${answer.totalAmount} ${tokenSymbol})`
            ).join('\n');
    
            const caption = `${title}\n\nPredicted so far: ${totalAmountQuest} ${tokenSymbol}\n\n${answersDescription}`;
            await ctx.telegram.editMessageCaption(
              msg.chat.id,
              msg.message_id,
              undefined,
              caption,
              {
                parse_mode: "Markdown",
                ...Markup.inlineKeyboard(inlineKeyboard),
              }
            );
            
            userConnections.set(userId, true);
          }
          else {
            setTimeout(checkConnection, 500); 
          }
        };
        const checkSign = async () => {
          if(successTransaction) {
            // await ctx.telegram.editMessageCaption(
            //   msg.chat.id,
            //   msg.message_id,
            //   undefined,
            //   `Wait for confirm`,
            //   {
            //     parse_mode: "Markdown",
            //     ...Markup.inlineKeyboard([
            //       Markup.button.url("View status", "https://polyquest.xyz"),
            //     ]),
            //   }
            // );
            
            // Tạo transaction
            console.log(tx)
            const transaction: Transaction = Transaction.from(base58.decode(tx));
            console.log(transaction.serialize().toString("base64"))
            const dataVoting = {
              data: {
                bettingId: bettingID,
                signedTx: transaction.serialize().toString("base64"),
              },
            };
            
            // Gửi yêu cầu POST
            try {
              // const response = await fetch(
              //   "https://polyquest.xyz/api/actions/bettings/confirm",
              //   {
              //     method: "POST",
              //     headers: {
              //       "Content-Type": "application/json",
              //     },
              //     body: JSON.stringify(dataVoting),
              //   }
              // );
              // const responseData = await response.json();
              // console.log(responseData)
              // // Lấy trường bettingTxn
              // const bettingTxn = responseData.bettingTxn;
              // const solscanUrl = `https://solscan.io/tx/${bettingTxn}`; 
              if (dataVoting) {
                // Thay đổi nút khi xác nhận thành công
                await ctx.telegram.editMessageCaption(
                  msg.chat.id,
                  msg.message_id,
                  undefined,
                  `Confirm successful`,
                  {
                    parse_mode: "Markdown",
                    ...Markup.inlineKeyboard([
                      Markup.button.url("View status", 'https://polyquest.xyz'),
                    ]),
                  }
                );
              } else {
                await ctx.telegram.editMessageCaption(
                  msg.chat.id,
                  msg.message_id,
                  undefined,
                  `Confirm failed. Please try again later.`,
                  {
                    parse_mode: "Markdown",
                    ...Markup.inlineKeyboard([
                      Markup.button.url("View status", "https://polyquest.xyz"),
                    ]),
                  }
                );
              }
            } catch (error) {
              console.error("Error during confirmation:", error);
              await ctx.telegram.editMessageCaption(
                msg.chat.id,
                msg.message_id,
                undefined,
                `An error occurred. Please try again later.`,
                {
                  parse_mode: "Markdown",
                  ...Markup.inlineKeyboard([
                    Markup.button.url("View status", "https://polyquest.xyz"),
                  ]),
                }
              );
            }            
          }
          else {
            setTimeout(checkSign, 500); 
          }
        }
        checkConnection();
        checkSign();
      }
    }
    else {
      if ( data ) {
        const inlineKeyboard: InlineKeyboardButton[] = [];
        for (let index_anser = 0; index_anser < data.answers.length; index_anser++) {
          const action = data.answers[index_anser];
          const url = await signTransaction(5);
          if ( url ) {
            const button = Markup.button.url(action.title, url);
            inlineKeyboard.push(button);
          }
        }
        const title = data?.title;
        const description = data?.description;
        const imageUrl = data?.imageUrl;
        const answers = data?.answers;
        const totalAmountQuest = data?.totalAmount;
        const token = data?.token;
        const tokenSymbol = token.symbol;
        const tokenDecimals = token.decimals;

        // Tính tổng số tiền từ các câu trả lời
        const totalAmount = answers.reduce((sum, answer) => sum + answer.totalAmount, 0) / (10 ** tokenDecimals);

        // Tạo mô tả cho các câu trả lời
        const answersDescription = answers.map(answer => 
          `${answer.title} : ${(answer.percent * 100).toFixed(1)}% (${answer.totalAmount} ${tokenSymbol})`
        ).join('\n');

        // Tạo caption với tiêu đề, tổng số tiền và mô tả câu trả lời
        const caption = `${title}\n\nPredicted so far: ${totalAmountQuest} ${tokenSymbol}\n\n${answersDescription}`;
        console.log(caption)
        var msg = await ctx.replyWithPhoto(
          { url: data?.imageUrl },
          {
            caption: caption,
            parse_mode: "Markdown",
            ...Markup.inlineKeyboard(inlineKeyboard),
          }
        );
        const checkConnection = async () => {
          if (phantomWalletPublicKey) { 
            const inlineKeyboard: InlineKeyboardButton[][] = []; 

            for (let index_anser = 0; index_anser < data.answers.length; index_anser++) {
              const action = data.answers[index_anser];
              const url = await signTransaction(1);
              
              if (url) {
                const button = Markup.button.url(action.title, url);
                inlineKeyboard.push([button]); 
              }
            }
            
            const title = data?.title;
            const description = data?.description;
            const imageUrl = data?.imageUrl;
            const answers = data?.answers;
            const totalAmountQuest = data?.totalAmount;
            const token = data?.token;
            const tokenSymbol = token.symbol;
            const tokenDecimals = token.decimals;
    
            const totalAmount = answers.reduce((sum, answer) => sum + answer.totalAmount, 0) / (10 ** tokenDecimals);
    
            const answersDescription = answers.map(answer => 
              `${answer.title} : ${(answer.percent * 100).toFixed(1)}% (${answer.totalAmount} ${tokenSymbol})`
            ).join('\n');
    
            const caption = `${title}\n\nPredicted so far: ${totalAmountQuest} ${tokenSymbol}\n\n${answersDescription}`;
            await ctx.telegram.editMessageCaption(
              msg.chat.id,
              msg.message_id,
              undefined,
              caption,
              {
                parse_mode: "Markdown",
                ...Markup.inlineKeyboard(inlineKeyboard),
              }
            );
            
            userConnections.set(userId, true);
          }
          else {
            setTimeout(checkConnection, 500); 
          }
        };
        const checkSign = async () => {
          if(successTransaction) {
            console.log(msg.message_id)
            // await ctx.telegram.editMessageCaption(
            //   msg.chat.id,
            //   msg.message_id,
            //   undefined,
            //   `Wait for confirm`,
            //   {
            //     parse_mode: "Markdown",
            //     ...Markup.inlineKeyboard([
            //       Markup.button.url("View status", "https://polyquest.xyz"),
            //     ]),
            //   }
            // );
            
            // Tạo transaction
            const transaction: Transaction = Transaction.from(base58.decode(tx));
            const dataVoting = {
              data: {
                bettingId: bettingID,
                signedTx: transaction.serialize().toString("base64"),
              },
            };
            
            // Gửi yêu cầu POST
            try {
              const response = await fetch(
                "https://polyquest.xyz/api/actions/bettings/confirm",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(dataVoting),
                }
              );
              console.log(response.body)
              if (dataVoting) {
                // Thay đổi nút khi xác nhận thành công
                await ctx.telegram.editMessageCaption(
                  msg.chat.id,
                  msg.message_id,
                  undefined,
                  `Confirm successful`,
                  {
                    parse_mode: "Markdown",
                    ...Markup.inlineKeyboard([
                      Markup.button.url("View status", "https://polyquest.xyz"),
                    ]),
                  }
                );
              } else {
                console.error("Failed to confirm:", await response.text());
                await ctx.telegram.editMessageCaption(
                  msg.chat.id,
                  msg.message_id,
                  undefined,
                  `Confirm failed. Please try again later.`,
                  {
                    parse_mode: "Markdown",
                    ...Markup.inlineKeyboard([
                      Markup.button.url("View status", "https://polyquest.xyz"),
                    ]),
                  }
                );
              }
            } catch (error) {
              console.error("Error during confirmation:", error);
              await ctx.telegram.editMessageCaption(
                msg.chat.id,
                msg.message_id,
                undefined,
                `An error occurred. Please try again later.`,
                {
                  parse_mode: "Markdown",
                  ...Markup.inlineKeyboard([
                    Markup.button.url("View status", "https://polyquest.xyz"),
                  ]),
                }
              );
            }            
          }
          else {
            setTimeout(checkSign, 500); 
          }
        }
        checkConnection();
        checkSign();
      }
    }
  }  
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
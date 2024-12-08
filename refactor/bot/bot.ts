// bot.ts
import { Telegraf } from 'telegraf';

const bot = new Telegraf();


export const launchBot = () => {
  bot.launch();
  setTimeout(() => {
    bot.telegram.callApi("getMe", {});
  }, 30000);
  
  const addLog = (log: string) => {
    console.log("> " + log);
  };
};

export default bot;
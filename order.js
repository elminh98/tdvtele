const { Telegraf, Context } = require('telegraf');
const axios = require('axios');
const { message } = require('telegraf/filters');

const bot = new Telegraf('5619398857:AAE2a_xwMHCj97YziXuaz3tiwY5PNg04zHE');

bot.on('message', (ctx) => {
  console.log(`User ${ctx.from.username} reacted with ${ctx.message.text} in the Telegram group.`);
});

bot.startPolling();
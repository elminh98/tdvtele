const express = require('express')

const app = express()
const port = 3000

app.use(express.urlencoded());
app.use(express.json());

app.get('/', (req, res) => {
    return res.send('Hello World!');
})
app.post('/webhook', (req, res) => {
    console.log(req.body);
    if (req.body.symbol) {
    bot.telegram.sendMessage(-1001789955214,`${req.body.symbol} crossing ${req.body.price}\r\n ${req.body.link}`);
    res.send('receive');}
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


//
const { Telegraf, Context } = require('telegraf');
const { message } = require('telegraf/filters');
var fs = require('fs');
const bot = new Telegraf('5888824865:AAEo3fnhQikuU7kkBzdozKDnBnL0lfnZ6r4');
bot.on("message", ctx => {
    console.log(ctx.update)
})

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
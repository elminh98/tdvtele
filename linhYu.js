const express = require('express')

const app = express()
const port = 3000
const urlBingX = "https://api-swap-rest.bingbon.pro/api/v1/user/getBalance";
const keys = {
    "akey": "oyyLug3tbuT4MCHxC2wlJFO3yHyEgfleWhDAIXWeDJV3brHMV1VqrhFyXTSez2NxWSiqhYuvt3MS3bsj4AxZA",
    "skey": "tlMw3C5NDEbALtazN7Qmi1I7ggVWCs5Fp9KlJMe2oCe26VFEMt17SBNojJnelbiDJSzyeVrVTEmBlyfo1Gw"
};
let timestamp = Date.now();
let currency = "USDT";
let paramString = `apiKey=${keys.akey}&currency=${currency}&timestamp=${timestamp}`
let originString = `POST/api/v1/user/getBalanceapiKey=${keys.akey}&currency=${currency}&timestamp=${timestamp}`
console.log(keys.akey, timestamp, currency);
var profitFx;
app.use(express.urlencoded());
app.use(express.json());

app.get('/webhook', (req, res) => {
  res.send('Hello World!')
})
app.post('/forex', (req, res) => {
    console.log(req.body);
    profitFx = req.body.data.replace('\x00', '');
    console.log(profitFx)
    bot.telegram.sendMessage(849997222,`Profit in MT5: ${profitFx}`);
})
app.get('/forex', (req, res) => {
    res.send(profitFx)
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
const express = require('express')

const app = express()
const port = 80

app.use(express.urlencoded());
app.use(express.json());

app.get('/', (req, res) => {
    return res.send('Hello World!');
})
app.post('/webhook', (req, res) => {
    console.log(req.body);
    if (req.body.symbol) {
        let user = req.body.id
    bot.telegram.sendMessage(user,`${req.body.symbol} cross ${req.body.price}`);
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
var arr = []
bot.on("message", ctx => {
    if (arr.includes(ctx.update.message.chat.id)) {console.log("đã tồn tại")} else {arr.push(ctx.update.message.chat.id)}
    console.log(arr)
    bot.telegram.sendMessage(ctx.update.message.chat.id,`Hướng dẫn cài đặt thông báo trên TDV \r\n Dán link này vào mục webhook URL http://103.231.248.29:80/webhook, \r\n Ô message bên dưới nhập: {"id": ${ctx.update.message.chat.id}, "symbol": "{{ticker}}", "price": "{{close}}}`)
})

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
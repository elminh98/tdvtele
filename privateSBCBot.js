const { Telegraf, Context } = require('telegraf');
const { message } = require('telegraf/filters');
var fs = require('fs');
const WebSocket = require('ws');
const axios = require('axios');
// const coinlist = [];
// async function coingeckoList() {
// await axios.get('https://api.coingecko.com/api/v3/coins/list')
// .then(x => coinlist = x);
// console.log(coinlist)
// }
// coingeckoList();
const {
    WebsocketClient,
    FuturesClient,
    SpotClient,
    DefaultLogger
  } = require('bitget-api');
const ws = new WebSocket('wss://fstream.binance.com/stream?streams=!markPrice@arr@1s');
var largeFundingRate;
var array;

function socket() {
ws.onmessage = async function (event) {
    const data = JSON.parse(event.data);
    array = Array.from(data.data);
    console.log(array.length)
    largeFundingRate = 
        array.filter(item => Math.abs(item.r * 100) > 0.05)
        .sort((a,b) => {return a.r*1 - b.r*1})
        .slice(0,5)
}
}
socket();
const keyBitget = fs.readFileSync('./privateSBCBOT/key.json', {encoding: 'utf-8'});
const keys = JSON.parse(keyBitget);
const API_KEY = keys[0].akey;
const API_SECRET = keys[0].skey;
const API_PASS = keys[0].pkey;
const client = new FuturesClient({
    apiKey: API_KEY,
    apiSecret: API_SECRET,
    apiPass: API_PASS,
    // apiKey: 'apiKeyHere',
    // apiSecret: 'apiSecretHere',
    // apiPass: 'apiPassHere',
  });
const bot = new Telegraf('5853603727:AAHzSjHWKkavnbv1iwcUbZUDOdGq4SsofLQ');
//Khai báo nút Close
const closeButton = [
    { text: 'Close', callback_data: 'close'},  
];
bot.action('close', ctx => {
    ctx.deleteMessage()
})
bot.command('p', ctx => {
    let text = ctx.update.message.text.split(" ")[1].toUpperCase()
    usdtPair = text + "USDT"
    busdPair = text + "BUSD"
    try{
    let coinCheck = array.filter(item => item.s == usdtPair);
    console.log(coinCheck)
    if (coinCheck.length == 1) {
        bot.telegram.sendMessage(ctx.update.message.chat.id, `${coinCheck[0].s}: ${Number(coinCheck[0].p).toFixed(4)}`);
    } else {
        let coinCheck = array.filter(item => item.s == busdPair);
        if (coinCheck.length == 1) {
            bot.telegram.sendMessage(ctx.update.message.chat.id, `${coinCheck[0].s}: ${Number(coinCheck[0].p).toFixed(4)}`);
        } else {
            let coinCheck = spotArray.filter(item => item.s == usdtPair);
            if (coinCheck.length == 1) {
            bot.telegram.sendMessage(ctx.update.message.chat.id, `${coinCheck[0].s}: ${Number(coinCheck[0].c).toFixed(4)}`);
            } else {
                let coinCheck = spotArray.filter(item => item.coin == busdPair);
                bot.telegram.sendMessage(ctx.update.message.chat.id, `${coinCheck[0].s}: ${Number(coinCheck[0].c).toFixed(4)}`);
            }
        }
    }
    } catch {bot.telegram.sendMessage(ctx.update.message.chat.id,  `${text} không có trên Binance`)};
});
bot.command('bot', ctx => {
    bot.telegram.sendMessage(ctx.update.message.chat.id, `Guide:\r\n/food - kèo\r\n/outlook - nhận định thị trường\r\n/volume Cú pháp:"/volume entry stoploss R"\r\n/fundingrate : Check fungding rate top Binance\r\n/spot : Check kèo spot\r\n /p btc : check giá coin future`);
});
bot.command('spot', ctx => {
    ctx.deleteMessage();
    var spotButtons = [];
    var spotSignals = fs.readFileSync('./spot.txt', { encoding: "utf-8"});
    var splitSpotLine = spotSignals.split('\r\n');
    splitSpotLine.forEach(myfunction)
    function myfunction(splitSpotLine) {
        var nameSpot = splitSpotLine.split('|')[0];
        var linkSpot = splitSpotLine.split('|')[1];
        var spotButton = [
            { text: `${nameSpot}`, url: `${linkSpot}`}
        ];
        spotButtons.push(spotButton);
    };
    spotButtons.push(closeButton);
    bot.telegram.sendMessage(ctx.chat.id, 'Kèo spot',
    {
        reply_markup: {
            inline_keyboard: spotButtons
        }
    }
    );
})
bot.command('fundingrate', ctx => {
    let content = '';
    for (let i = 0; i < largeFundingRate.length; i++) {
        content += "\r\n" + largeFundingRate[i].s + ": " + Number(largeFundingRate[i].r)*100 
    }
    console.log(content);
    bot.telegram.sendMessage(ctx.update.message.chat.id, content);
})
bot.action('active', ctx => {
    var active = fs.readFileSync('./privateSBCBOT/active.txt', { encoding: "utf-8"});
    var activeTable = [];
    var handleActiveString = active.split("\r\n");
    handleActiveString.forEach(element => {
        var obj = element.split(" ");
        var form = {
            ls: obj[0],
            symbol: obj[1],
            entry: obj[2],
            status: obj[3],
            link: obj[4]
            }
            activeTable.push(form);
        });
        foodArray = [];
        for (var i = 0; i < (handleActiveString.length - 1); i++) {
            var foodIndex = [{
                text: `${activeTable[i].ls} ${activeTable[i].symbol} ${activeTable[i].entry} ${activeTable[i].status}` , url: `${activeTable[i].link}`
            }];
                
            foodArray.push(foodIndex);
        }
        foodArray.push(closeButton)
    bot.telegram.sendMessage(ctx.chat.id, 'Kèo đang chờ khớp',
        {
        reply_markup: {
            inline_keyboard: foodArray
            }
        })
    })

bot.action('done', ctx => {
    var done = fs.readFileSync('./privateSBCBOT/done.txt', { encoding: "utf-8"});
    var doneTable = [];
    var handleDoneString = done.split("\r\n");
    handleDoneString.forEach(element => {
        var obj = element.split(" ");
        var form = {
            ls: obj[0],
            symbol: obj[1],
            entry: obj[2],
            status: obj[3],
            link: obj[4]
            }
            doneTable.push(form);
        });
        foodArray = [];
        for (var i = 0; i < (handleDoneString.length - 1); i++) {
            var foodIndex = [{
                text: `${doneTable[i].ls} ${doneTable[i].symbol} ${doneTable[i].entry} ${doneTable[i].status}` , url: `${doneTable[i].link}`
            }];
                
            foodArray.push(foodIndex);
        }
        foodArray.push(closeButton)
    bot.telegram.sendMessage(ctx.chat.id, 'Kèo Done',
        {
        reply_markup: {
            inline_keyboard: foodArray
            }
        })
    })
bot.action('cancel', ctx => {
    var cancel = fs.readFileSync('./privateSBCBOT/cancel.txt', { encoding: "utf-8"});
    var cancelTable = [];
    var handleCancelString = cancel.split("\r\n");
    handleCancelString.forEach(element => {
        var obj = element.split(" ");
        var form = {
            ls: obj[0],
            symbol: obj[1],
            entry: obj[2],
            status: obj[3],
            link: obj[4]
            }
            cancelTable.push(form);
        });
        foodArray = [];
        for (var i = 0; i < (handleCancelString.length - 1); i++) {
            var foodIndex = [{
                text: `${cancelTable[i].ls} ${cancelTable[i].symbol} ${cancelTable[i].entry} ${cancelTable[i].status}` , url: `${cancelTable[i].link}`
            }];
                
            foodArray.push(foodIndex);
        }
        foodArray.push(closeButton)
    bot.telegram.sendMessage(ctx.chat.id, 'Kèo Hủy',
        {
        reply_markup: {
            inline_keyboard: foodArray
            }
        })
    })
// Food
bot.command('food', ctx => {
    var active = fs.readFileSync('./privateSBCBOT/active.txt', { encoding: "utf-8"});
    var activeTable = [];
    var handleActiveString = active.split("\r\n");
    handleActiveString.forEach(element => {
        var obj = element.split(" ");
        var form = {
            ls: obj[0],
            symbol: obj[1],
            entry: obj[2],
            status: obj[3],
            link: obj[4]
            }
            activeTable.push(form);
        });
        foodArray = [];
        for (var i = 0; i < (handleActiveString.length - 1); i++) {
            var foodIndex = [{
                text: `${activeTable[i].ls} ${activeTable[i].symbol} ${activeTable[i].entry} ${activeTable[i].status}` , url: `${activeTable[i].link}`
            }];
                
            foodArray.push(foodIndex);
        }
        foodArray.push([
            { text: "Kèo done", callback_data: 'done'},
            { text: "Kèo hủy", callback_data: 'cancel'}
        ])
        foodArray.push(closeButton)
    bot.telegram.sendMessage(ctx.chat.id, 'Kèo đang chờ khớp',
        {
        reply_markup: {
            inline_keyboard: foodArray
            }
        })
   
})

// Lesson
bot.command('outlook', ctx => {
    let buttons = [];
    let outlook = fs.readFileSync('./privateSBCBOT/outlook.txt', {encoding: 'utf-8'});
    let lineByLine = outlook.split("\r\n");
    lineByLine.forEach(item => {
        if (item != '') {
            let arr = item.split('|');
            let button = [{ text: `${arr[0]}`, url: `${arr[1]}`}];
            buttons.push(button)
        }
    })
    buttons.push(closeButton);
    bot.telegram.sendMessage(ctx.chat.id, 'Outlook',
        {
        reply_markup: {
            inline_keyboard: buttons
            }
        })
});

//Caculator volume
bot.command('volume', async ctx => {
    let positionSize;
    console.log(ctx.update.message.chat.id)
    let volumeCommand = ctx.update.message.text.split(" ");
    try {
        let lot;
        let side;
        let entry = Number(volumeCommand[1]);
        let sl = Number(volumeCommand[2]);
        let riskedCapital = Number(volumeCommand[3]);
        let tp1;
        let tp2;
        let fee = 0.0002
        console.log(entry, sl, riskedCapital)
        if (entry < sl) {
            side = "Short";
            positionSize = riskedCapital / (sl - entry);
            lot = positionSize/100000
            sideUSDT = positionSize * entry;
            orderFee = sideUSDT * fee;
            tp1IncludeFee = entry - (riskedCapital + orderFee*2) / positionSize
            tp2IncludeFee = entry - (riskedCapital*2 + orderFee*2) / positionSize
            tp1 = entry - (riskedCapital + orderFee) / positionSize;
            tp2 = entry - riskedCapital*2 / positionSize;
        } else if (entry > sl) {
            side = "Long";
            positionSize = riskedCapital / (entry - sl);
            lot = positionSize/100000
            sideUSDT = positionSize*entry;
            orderFee = sideUSDT*fee;
            tp1IncludeFee = entry + (riskedCapital + orderFee*2) / positionSize
            tp2IncludeFee = entry + (riskedCapital*2 + orderFee*2) / positionSize
            tp1 = entry + riskedCapital / positionSize;
            tp2 = entry + riskedCapital * 2 / positionSize;
        }
        console.log('Fee :' + orderFee)
        console.log('tp1 include Fee: ' + tp1IncludeFee)
        console.log(ctx.update.message.chat.username)
        if (ctx.update.message.chat.username) {
            console.log(ctx.update.message.chat.username, riskedCapital)
        } else {
            console.log(ctx.update.message.chat.id, riskedCapital)
        };
        bot.telegram.sendMessage(ctx.update.message.chat.id, `${side} entry: ${entry}\r\nVolume (số coin): ${positionSize.toFixed(3)}\r\nVolume (USDT): ${sideUSDT.toFixed(3)}\r\nLot : ${lot.toFixed(2)}\r\nGiá chốt 1R ở: ${tp1.toFixed(4)}\r\nGiá chốt 2R ở: ${tp2.toFixed(4)}\r\nCắt lỗ ${riskedCapital} ở giá ${sl}$\r\n\r\nPhí vào lệnh: ${orderFee.toFixed(2)}$\r\nChốt 1R tính cả phí là: ${tp1IncludeFee.toFixed(5)}\r\nChốt 2R tính cả phí là: ${tp2IncludeFee.toFixed(5)}\r\nLưu ý: Phí trên sàn Bitget.`);
        // bot.telegram.sendMessage(ctx.update.message.chat.id,  `\r\nPhí sàn Bitget: ${orderFee.toFixed(3)}\r\nChốt 1R tính cả phí vào lệnh ở: ${tp1IncludeFee.toFixed(3)}`);
        if (volumeCommand[5] == "order" | ctx.update.message.chat.id == 849997222) {
            function sizeCal() {
                if(positionSize >= 1000) {return positionSize.toFixed(0)
                } else if (positionSize < 1000 && positionSize >= 100) {return positionSize.toFixed(1)
                } else if (positionSize < 100 && positionSize >= 10) {return positionSize.toFixed(2)
                } else if (positionSize < 10 && positionSize >= 1) {return positionSize.toFixed(3)
                };
            }
            let orderObj = {
                symbol: volumeCommand[4].toUpperCase() + "USDT_UMCBL",
                marginCoin: "USDT",
                size: sizeCal(),
                price: entry+'',
                side: "open_" + side.toLowerCase(),
                orderType: 'limit',
                presetTakeProfitPrice: tp2.toFixed(3),
                presetStopLossPrice: sl+''
            };
            // let result = await sendOrder(orderObj)
            // result.then(x => console.log(x))
        }
    } catch {console.log("error")};
    function value(a) {
        if (a < 0) {
            return a * (-1);
        }
        return a;
    }
})
bot.on('channel_post', async ctx => {
    if (ctx.channelPost.chat.id == -1001516503199 | ctx.channelPost.chat.id == -1001613189878) {

        if (ctx.update.channel_post.text) {text = ctx.update.channel_post.text.toLowerCase()};
        if (ctx.update.channel_post.caption) {text = ctx.update.channel_post.caption.toLowerCase()};
        console.log(text)
        if (text.includes("entry") & text.includes("tp") & (text.includes("sl")|text.includes("stl"))) {
            var textLines = text.replace("$",'').split('\n');
            console.log(textLines)
            var postion;
            var entry;
            var sl;
            var pair;
            for (var i = 0; i < textLines.length; i++) {
                if (textLines[i].includes('short') | textLines[i].includes('long')) {
                    if (textLines[i].includes('short')) {
                        postion = 'Short'//; rvPostion = 'BUY'
                    } else if (textLines[i].includes('long')) {
                        postion = 'Long'//; rvPostion = 'SELL'
                    };
                    list = fs.readFileSync('listSymbol.json');
                    var listSymbol = JSON.parse(list);
                    var symbol = textLines[i].replace('#','').replace('$','').split(' ').filter(item => listSymbol.includes(item))
                    console.log(symbol[0])
                    pair = symbol[0].toUpperCase() + 'USDT'
                    console.log(pair)}
                else if (textLines[i].includes('entry') & textLines[i].length <= 20) {
                    findEntry = textLines[i].replace(' ', '').split('');
                    var entryArray = findEntry.filter(item => (!isNaN(item) | item === ".") & item !== '' );
                    console.log(entryArray)
                    entry = entryArray.join('')*1;
                    console.log('entry: ', entry)
                }
            else if ((textLines[i].includes('stl')|textLines[i].includes('sl')) & textLines[i].length <= 14) {
                findStopLoss = textLines[i].replace(' ', '').split('');
                var stopLossArray = findStopLoss.filter(item => (!isNaN(item) | item === ".") & item !== '');
                sl = stopLossArray.join('')*1;
                console.log('sl:', sl)}
            }
            var link = `https://t.me/c/1516503199/${ctx.channelPost.message_id}\r\n`;
            console.log(`${postion} ${pair} ${entry} sl${sl} ${link}`);
            fs.appendFileSync('./privateSBCBOT/active.txt', `${postion} ${pair} ${entry} sl${sl} ${link}`, function(err) {
                if (err) throw err;
                    console.log('Saved!');
                });
            fs.appendFileSync('./food.txt', `${postion} ${pair} ${entry} SBC https://t.me/SuonBiChaTrading/473\r\n`, function(err) {
                if (err) throw err;
                    console.log('Saved!');
                });
        };
    };
    
});


bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

//Function Trade
async function sendOrder(obj){
    let result = await client.submitOrder({
    symbol: obj.symbol,
    marginCoin: obj.marginCoin,
    size: obj.size.toString(),
    price: obj.price.toString(),
    side: obj.side,
    orderType: obj.orderType,
    presetTakeProfitPrice: obj.presetTakeProfitPrice.toString(),
    presetStopLossPrice: obj.presetStopLossPrice.toString()
  });
    return result;
 }
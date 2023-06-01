const { Telegraf, Context } = require('telegraf');
const { message } = require('telegraf/filters');
var fs = require('fs');
const bot = new Telegraf('5987728677:AAEcufHcQbzirBJW5aWHGN6zUZK4Wz4GQKA');
//Khai báo nút Close
const closeButton = [
    { text: 'Close', callback_data: 'close'},  
];
//Start Bot
bot.start((ctx) => {
    ctx.reply(`Chào sếp ${ctx.from.first_name} ${ctx.from.last_name} ạ!`);
})
bot.help((ctx) => {
    ctx.reply("Bạn cần hỗ trợ gì ạ");
})
bot.settings((ctx) => {
    ctx.reply("Cài đặt");
})
//Hiện menu bot
bot.command('menu', ctx => {
    var menuMain = fs.readFileSync('./menu.txt', { encoding: 'utf-8'});
    var menuButton = menuMain.split('\r\n');
    bot.telegram.sendMessage(ctx.chat.id, 'Menu',
    {
        reply_markup: {
            inline_keyboard:[
                [
                    { text: menuButton[0].split('|')[0], url: menuButton[0].split('|')[1]},
                    
                ],
                [
                    { text: menuButton[1].split('|')[0], url: menuButton[1].split('|')[1]},
                    { text: menuButton[2].split('|')[0], url: menuButton[2].split('|')[1]},
                    { text: menuButton[3].split('|')[0], url: menuButton[3].split('|')[1]},
                    { text: menuButton[4].split('|')[0], url: menuButton[4].split('|')[1]},
                ],
                [
                    { text: menuButton[5].split('|')[0], url: menuButton[5].split('|')[1]},
                    
                ],
                [
                    { text: menuButton[6].split('|')[0], url: menuButton[6].split('|')[1]},
                    { text: menuButton[7].split('|')[0], url: menuButton[7].split('|')[1]},
                ],
                [
                    
                    { text: menuButton[8].split('|')[0], url: menuButton[8].split('|')[1]},
                    { text: menuButton[9].split('|')[0], url: menuButton[9].split('|')[1]},
                ],
                [
                    { text: menuButton[10].split('|')[0], url: menuButton[10].split('|')[1]},
                    { text: menuButton[11].split('|')[0], url: menuButton[11].split('|')[1]},
                    { text: menuButton[12].split('|')[0], callback_data: menuButton[12].split('|')[1]}
                ],
                [
                    { text: menuButton[13].split('|')[0], url: menuButton[13].split('|')[1]},
                    { text: menuButton[14].split('|')[0], url: menuButton[14].split('|')[1]}
                    
                ],[
                    { text: menuButton[15].split('|')[0], callback_data: menuButton[15].split('|')[1]}
                    
                ],
                [
                    { text: 'Tài liệu', callback_data: 'documents'},
                ],
                // [
                //     { text: 'Report', callback_data: 'journey'},
                    
                // ],
                [
                    { text: 'Close', callback_data: 'close'},
                    
                ]
            ]
        }
    })
})
bot.command('food', ctx => {
    var food = fs.readFileSync('./food.txt', { encoding: "utf-8"});
    var table = [];
    var array = food.split("\r\n");
    array.forEach(element => {
        var obj = element.split(" ");
        var form = {
            ls: obj[0],
            symbol: obj[1],
            entry: obj[2],
            status: obj[3],
            link: obj[4]
            }
        table.push(form);
        });
        foodArray = [];
        for (var i = 0; i < (array.length - 1); i++) {
            var foodIndex = [{
                text: `${table[i].ls} ${table[i].symbol} ${table[i].entry} ${table[i].status}` , url: `${table[i].link}`
            }];
                
            foodArray.push(foodIndex);
        }
        foodArray.push(closeButton)
        console.log('Gọi lệnh food, hiển thị ' + foodArray.length - 1 + 'kèo');
    bot.telegram.sendMessage(ctx.chat.id, 'Food',
        {
        reply_markup: {
            inline_keyboard: foodArray
            }
        })
    })

bot.on(message('text'), (ctx) => {
    console.log(ctx.update.message.text)
    var firstLine = ctx.update.message.text.split("\n")[0];
    // Explicit usage
    var aiReply = fs.readFileSync('./aiReply.txt', { encoding: "utf-8"})
    var aiReplyLine = aiReply.split("\r\n");
    var readMess = [];
    var contentArray =[];
    for (var i = 0; i < aiReplyLine.length; i++) {
        var keyword = aiReplyLine[i].split('|');
        readMess.push(keyword[0])
    };
    for (var i = 0; i < aiReplyLine.length; i++) {
        var content = aiReplyLine[i].split('|');
        contentArray.push(content[1])
    }
    var receiveContent = ctx.update.message.text.toLocaleLowerCase().split(' ')
    // console.log(receiveContent)
    if (readMess.includes(ctx.update.message.text)) {
            ctx.telegram.sendMessage(ctx.message.chat.id, `${contentArray[readMess.indexOf(ctx.update.message.text)]}`);
        } else {
        receiveContent.some(element => {
        if (readMess.includes(element)) {
            let index = readMess.indexOf(element)
            // console.log(receiveContent.indexOf(element))
            ctx.telegram.sendMessage(ctx.message.chat.id, `${contentArray[index]}`);
        };
        });}
    var learnTalk = ctx.update.message.text.split(':')
    if ( learnTalk[0] == "dayBeNoi" ) {
        var learn = learnTalk[1].split('|');
        fs.appendFileSync('./aiReply.txt', `\r\n${learn[0]}|${learn[1]}`, function(err) {
            if (err) throw err;
                console.log('Saved!');
            })
            ctx.telegram.sendMessage(ctx.message.chat.id, `Gặp "${learn[0]}" thì trả lời là "${learn[1]}" ạ`);
        };
    // Thêm food
    var signal = ctx.update.message.text.split('|')
    if ( signal[0].toLowerCase() == "addfood" ) {
        var signalIndex = signal[1].split('_');
        fs.appendFileSync('./food.txt', `${signalIndex[0]} ${signalIndex[1]} ${signalIndex[2]} ${signalIndex[3]} ${signalIndex[4]}\r\n`, function(err) {
            if (err) throw err;
                    console.log('Saved!');
            })
            ctx.telegram.sendMessage(ctx.message.chat.id, `Đã lưu lệnh "${signalIndex[0]}" "${signalIndex[1]}" ạ`);
        } else if ( signal[0].toLowerCase() == "delfood") {
            fs.writeFile('./food.txt', '', function(){console.log('done')})
            ctx.telegram.sendMessage(ctx.message.chat.id, `Clear food done!`);
        };
    // Thêm spot
    var signalSpot = ctx.update.message.text.split('|')
    if ( signalSpot[0].toLowerCase() == "addspot" ) {
        var signalSpotIndex = signalSpot[1].split('_');
        fs.appendFileSync('./spot.txt', `${signalSpotIndex[0]}|${signalSpotIndex[1]}\r\n`, function(err) {
            if (err) throw err;
                    console.log('Saved!');
            })
            ctx.telegram.sendMessage(ctx.message.chat.id, `Đã lưu kèo spot ${signalSpotIndex[0]} ạ`);
        } else if ( signal[0].toLowerCase() == "delspot") {
            fs.writeFile('./spot.txt', '', function(){console.log('done')})
            ctx.telegram.sendMessage(ctx.message.chat.id, `Clear spot done!`);
        };    
    });
    bot.action('guide', ctx => {
        ctx.deleteMessage();
        var guideButtons = [];
        var guideSignals = fs.readFileSync('./guide.txt', { encoding: "utf-8"});
        var splitGuideLine = guideSignals.split('\r\n');
        splitGuideLine.forEach(myfunction)
        function myfunction(splitGuideLine) {
            var nameGuide = splitGuideLine.split('|')[0];
            var linkGuide = splitGuideLine.split('|')[1];
            var guideButton = [
                { text: `${nameGuide}`, url: `${linkGuide}`}
            ];
            guideButtons.push(guideButton);
        };
        guideButtons.push(closeButton);
        bot.telegram.sendMessage(ctx.chat.id, 'Guide Line',
        {
            reply_markup: {
                inline_keyboard: guideButtons
            }
        }
        );
    })
bot.action('close', ctx => {
    ctx.deleteMessage()
})
bot.action('spot', ctx => {
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
bot.action('documents', ctx => {
    var documentButtons = [];
    var document = fs.readFileSync('./documents.txt', { encoding: "utf-8"})
    var splitLineDoc = document.split('\r\n');
    splitLineDoc.forEach(myfunction)
    function myfunction(splitLineDoc) {
        var nameDoc = splitLineDoc.split('|')[0];
        var linkDoc = splitLineDoc.split('|')[1];
        var documentButton = [
            { text: `${nameDoc}`, url: `${linkDoc}`}
        ];
        documentButtons.push(documentButton);
    };
    documentButtons.push(closeButton)
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, 'Tài liệu',
    {
        reply_markup: {
            inline_keyboard: documentButtons
        }
    }
    );
});
bot.on('channel_post', async ctx => {
    // Match signal
    if (ctx.channelPost.chat.id == 1808321932 | ctx.channelPost.chat.id == -1001613189878) {
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
            var link = `https://t.me/SuonBiChaTrading/${ctx.channelPost.message_id}\r\n`
            fs.appendFileSync('food.txt', `${postion} ${pair} ${entry} sl${sl} ${link}`, function(err) {
                if (err) throw err;
                    console.log('Saved!');
                });
        };
        
    }
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// handle detect Menu
function detectMenu(text) {
    if (text.includes("Menu") & text.includes("Sườn") & text.includes("Bì") & text.includes("Chả") & text.includes("ngày")) {

    }
}
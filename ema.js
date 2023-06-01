const indicators = require("trading-indicator");
const fs = require("fs");
const ema = require("trading-indicator").ema
const tf = ["15m", "30m", "1h", "4h", "6h", "12h", "1d"]
async function start() {
    let list = fs.readFileSync('symbolsList.json', {encoding: "utf-8"});
    let symbols = JSON.parse(list)
    async function emaPair(pair) {
        for (let i = 0; i < tf.length; i++){
            console.log(pair, tf[i])
            let ema10 = await ema(10, "close", "bitget", "BTC/USDT", tf[i], false)
            let ema30 = await ema(30, "close", "bitget", "BTC/USDT", tf[i], false)
            let ema100 = await ema(100, "close", "bitget", "BTC/USDT", tf[i], false)
            console.log(ema10*100/ema100)
            console.log(ema30*100/ema100)
            console.log(ema100*100/ema100)
        }
    }
    for (let i = 0; i < symbols.length; i++){
        // emaPair(symbols[i]);
    }
    let ema10 = await ema(10, "close", "bitget", "BTC/USDT", "15m", false)
    let ema30 = await ema(30, "close", "bitget", "BTC/USDT", "15m", false)
    console.log(ema10)
    start();
}
start();

async function getSymbolBitget() {

}
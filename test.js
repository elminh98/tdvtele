const Binance = require('binance-api-node').default;

// Create a new instance of Binance API
const client = Binance({
  apiKey: '2CoSzLUDpE9NX7aAZ2lUHlzI8LKKJLETEGMp0PgabosGIdXaaMJpLwA8RiPzRZiT',
  apiSecret: 'IlWACBGB9oLTcCuGymHAxsQpNNXPwYPJz31kreDhtYpe4GWExNfaLhuZhlGMkqGg',
});

// Set limit order on Binance spot
// client.order({
//   symbol: 'BTCUSDT',
//   side: 'BUY',
//   type: 'LIMIT',
//   quantity: 1,
//   price: 10000,
//   timeInForce: 'GTC',
// });

//Set limit order on Binance future
client.futuresOrder({
  symbol: 'APTUSDT',
  side: 'SELL',
  type: 'LIMIT',
  quantity: 1000/3.9987.toFixed(0),
  price: 3.9987,
  timeInForce: 'GTC',
  positionSide: 'BOTH',
  positionType: 'SHORT',
})
.catch((err)=> console.log(err));
client.futuresOrder({
    type: 'STOP_MARKET',

})
client.futuresOrder({
    type: 'TAKE_PROFIT_MARKET'
})
var lastOrder;
client.futuresOpenOrders().then((res)=>{
    lastOrder = res[res.length - 1].orderId,
    client.futuresCancelOrder({
        symbol: res[res.length - 1].symbol,
        orderId: lastOrder,
        useServerTime: true
    })
})
client.futuresAccountBalance().then((res)=>console.log(res[6].balance));
client.futuresOrder(N)

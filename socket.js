var app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
const socket = io('wss://api.cointiger.com/exchange-market/ws');

socket.listen('message', (data) => {
    console.log(data);
  });
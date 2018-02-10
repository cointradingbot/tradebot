var app = require('express')()
var express = require('express')
var path = require('path')
var fs = require('fs')
var https = require('https')

const sslOptions = {
    cert: fs.readFileSync(path.join(__dirname + '/../sslcerts/fullchain.pem')),
    key: fs.readFileSync(path.join(__dirname + '/../sslcerts/privkey.pem')),
}

var server = https.createServer(sslOptions, app).listen(443)
var io = require('socket.io')(server);
// var http = require('http').Server(app)
// var io = require('socket.io')(http);

app.use(express.static('static'))
app.get('/health-check', (req, res) => res.sendStatus(200))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
        console.log('message: ' + msg);
    });
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

// http.listen(3000, () => {
//     console.log('listening on *:3000');
// });


const BotService = require('./BotService')

new BotService.BotService(io).runTradeBot()
const webSocket = require('ws');

const createEchoServer = server => {
    const wsServer = new webSocket.Server({ server })
    wsServer.on('connection', (ws, req) => {   //
        ws.send('1st');
        console.log('連線數', wsServer.clients.size);
        ws.on('message', message => {
            ws.send(message.toString())
        })
    })
}

module.exports = createEchoServer
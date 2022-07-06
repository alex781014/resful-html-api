const webSocket = require('ws');


const createChatServer = server => {
    const wsServer = new webSocket.Server({ server });
    const map = new Map();

    wsServer.on('connection', (ws, req) => {

        map.set(ws, { name: Math.floor(Math.random() * 1000) });

        ws.on('message', message => {
            const mObj = map.get(ws);
            let msg = {};
            let output = {};

            const jsonStr = message.toString();

            try {
                msg = JSON.parse(jsonStr);

                switch (msg.type) {
                    case 'name':
                        output = { type: 'system', data: `${mObj.name} 改名為 ${msg.data}` };
                        mObj.name = msg.data;
                        break;
                    default:
                        output = { ...msg, name: mObj.name };
                }
                wsServer.clients.forEach(c => {
                    if (c.readyState === webSocket.OPEN) {
                        c.send(JSON.stringify(output));
                    }
                })

            } catch (ex) {
                console.log(ex);
            }


        });
        ws.on('close', (event) => {
            console.log({ event });
            console.log('close 連線數', wsServer.clients.size);
        })

    });

};

module.exports = createChatServer;
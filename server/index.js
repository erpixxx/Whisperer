const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
// app.use(cors({ origin: 'https://erpix.dev' }));
app.use(express.static(path.join(__dirname, 'public')));
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
    ws.on('message', (message) => {
        try {
            ws.id = req.socket.remoteAddress + ':' + req.socket.remotePort;

            const data = JSON.parse(message.toString());
            if (data.type === 'register' && data.role) {

                if (data.role === 'controller' && Array.from(wss.clients).some(client => client.role === 'controller')) {
                    ws.send(JSON.stringify({ type: 'error', message: 'Controller is already registered.' }));
                    ws.close();
                    return;
                }
                ws.role = data.role;
                console.log(`Client ${ws.id} has registered role: ${ws.role}`);
                return;
            }

            if (data.type === 'scraped-dom') {
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN && client.role === 'controller') {
                        data.clientId = ws.id;
                        client.send(JSON.stringify(data));
                    }
                });
            }

            if (data.type === 'inject_message' || data.type === 'revert_message' || data.type === 'disconnect') {
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN && client.role === 'plugin') {
                        client.send(JSON.stringify(data));
                    }
                });
            }

        } catch (error) {
            console.error('Unexpected error:', error);
        }
    });

    ws.on('close', () => {
        console.log('Closed connection with:', ws.id);
    });
});

server.listen(5440, '127.0.0.1', () => { // TODO
    console.log('Uruchomiono serwer na porcie 5440');
});

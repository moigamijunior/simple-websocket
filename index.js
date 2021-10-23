import WebSocket, { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

// Configs
const DEBUG = true
const ISJSON = true
const WS = new WebSocketServer({ port: 8080 });

let response

WS.on('connection', (client) => {
    client.id = uuidv4() // Attaching ID to new user.

    if (DEBUG) console.log('New connection:', client.id)

    client.on('message', (message) => {
        message = (ISJSON) ? JSON.parse(message) : message
        if (DEBUG) console.log('Received:', message)

        if (ISJSON) {
            switch (message.request) {
                case 'offer':
                    response = {
                        response: 'offer',
                        uuid: message.uuid,
                        body: message.body
                    }
                    break;
                case 'answer':
                    response = {
                        response: 'answer',
                        uuid: message.uuid,
                        body: message.body
                    }
                    break;
                case 'ice-candidate':
                    response = {
                        response: 'ice-candidate',
                        uuid: message.uuid,
                        body: message.body
                    }
                    break;

                default:
                    break;
            }
        }

        WS.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                message = (ISJSON) ? JSON.stringify(response) : message
                client.send(message)
            }
        });
    })

    client.on('close', (client) => {
        if (DEBUG) console.log('New disconnection:', client.id)
    })
})
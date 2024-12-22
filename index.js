import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import { state } from './model/state.js';

const app= express();

app.get('/', (req, res) => {
    res.json({message: 'Hello'});
    });

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    console.log('WebSocket connected');

    ws.on('message', (message) => {
    console.log(`Received message => ${message}`);

    try {
        const data = JSON.parse(message);
        
        if(data.message === "fetch"){
            ws.send(JSON.stringify(state[0]));
        } else if(data.message === "update"){
            state[0] = data;
            wss.clients.forEach((client) => {
                    client.send(JSON.stringify(data));
            });
        } else{
            ws.send(JSON.stringify(
                {
                    message: "Unknown Error Occured",
                }
            ));
        }
    } catch (error) {
        console.log(error.message);
        ws.send(JSON.stringify(
            {
                message: error.message
            }
        ));
    }
    });
});

server.listen(443, () => {
    console.log('Server is running on port 443');
});

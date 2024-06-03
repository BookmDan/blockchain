'use strict';
const express = require("express");
const bodyParser = require('body-parser');
const { initP2PServer, connectToPeers, broadcast, responseLatestMsg, sockets } = require('./p2p');
const Blockchain = require('./blockchain');
const { generateNextBlock } = require('./block');

const http_port = process.env.HTTP_PORT || 3001;
const p2p_port = process.env.P2P_PORT || 6001;
const initialPeers = process.env.PEERS ? process.env.PEERS.split(',') : [];

const blockchain = new Blockchain(); // Create a blockchain instance

const initHttpServer = () => {
    const app = express();
    app.use(bodyParser.json());

    app.get('/blocks', (req, res) => res.send(JSON.stringify(blockchain.chain))); // Access the chain property of blockchain
    app.post('/mineBlock', (req, res) => {
        const newBlock = generateNextBlock(req.body.data, blockchain);
        blockchain.addBlock(newBlock);
        broadcast(responseLatestMsg(blockchain));
        console.log('block added: ' + JSON.stringify(newBlock));
        res.send();
    });
    app.get('/peers', (req, res) => {
        res.send(sockets.map(s => s._socket.remoteAddress + ':' + s._socket.remotePort));
    });
    app.post('/addPeer', (req, res) => {
        connectToPeers([req.body.peer]);
        res.send();
    });
    app.listen(http_port, () => console.log('Listening http on port: ' + http_port));
};

connectToPeers(initialPeers);
initHttpServer();
initP2PServer(p2p_port, blockchain); // Pass blockchain instance to the P2P server

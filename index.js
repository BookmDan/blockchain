const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const { initP2PServer, connectToPeers, broadcast, responseLatestMsg, blockchain } = require('./p2p');
const { generateNextBlock } = require('./block');

const http_port = process.env.HTTP_PORT || 3001;
const p2p_port = process.env.P2P_PORT || 6001;

const initHttpServer = () => {
  const app = express();
  app.use(bodyParser.json());

  app.get('/blocks', (req, res) => res.send(JSON.stringify(blockchain.chain)));
  app.post('/mineBlock', (req, res) => {
    const newBlock = generateNextBlock(blockchain.chain, req.body.data);
    blockchain.addBlock(newBlock);
    broadcast(responseLatestMsg());
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

initHttpServer();
initP2PServer(p2p_port, blockchain);
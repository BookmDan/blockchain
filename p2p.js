/**
 * Module for managing peer-to-peer communication in a blockchain network.
 **/

const WebSocket = require('ws');
const Blockchain = require('./blockchain');

const MessageType = {
  QUERY_LATEST: 0,
  QUERY_ALL: 1,
  RESPONSE_BLOCKCHAIN: 2
};

const sockets = [];

// Initializes p2p server
const initP2PServer = (p2pPort, blockchain) => {
  const server = new WebSocket.Server({ port: p2pPort });
  server.on('connection', (ws) => initConnection(ws, blockchain));
  console.log('listening websocket p2p port on: ' + p2pPort);
};

// Initializes connection with a peer
const initConnection = (ws, blockchain) => {
  sockets.push(ws);
  initMessageHandler(ws, blockchain);
  initErrorHandler(ws);
  write(ws, queryChainLengthMsg());

  ws.on('message', (data) => {
    const message = JSON.parse(data);
    switch (message.type) {
      case MessageType.QUERY_LATEST:
        write(ws, responseLatestMsg(blockchain));
        break;
      case MessageType.QUERY_ALL:
        write(ws, responseChainMsg(blockchain));
        break;
      case MessageType.RESPONSE_BLOCKCHAIN:
        handleBlockchainResponse(message, blockchain);
        break;
    }
  });
};

const JSONToObject = (data) => JSON.parse(data);

// Initializes the message handler for a WebSocket connection.
const initMessageHandler = (ws, blockchain) => {
  ws.on('message', (data) => {
    const message = JSONToObject(data);
    switch (message.type) {
      case MessageType.QUERY_LATEST:
        write(ws, responseLatestMsg(blockchain));
        break;
      case MessageType.QUERY_ALL:
        write(ws, responseChainMsg(blockchain));
        break;
      case MessageType.RESPONSE_BLOCKCHAIN:
        handleBlockchainResponse(message, blockchain);
        break;
    }
  });
};

// Writes a message to a WebSocket connection.
const write = (ws, message) => ws.send(JSON.stringify(message));

// Constructs a message requesting the latest block in the blockchain.
const queryChainLengthMsg = () => ({ type: MessageType.QUERY_LATEST });
const queryAllMsg = () => ({ type: MessageType.QUERY_ALL });
const responseChainMsg = (blockchain) => ({
  type: MessageType.RESPONSE_BLOCKCHAIN,
  data: JSON.stringify(blockchain.chain)
});
const responseLatestMsg = (blockchain) => ({
  type: MessageType.RESPONSE_BLOCKCHAIN,
  data: JSON.stringify([blockchain.getLatestBlock()])
});

// Handles a response containing blockchain data from a peer.
const handleBlockchainResponse = (message, blockchain) => {
  const receivedBlocks = JSONToObject(message.data).sort((b1, b2) => b1.index - b2.index);
  const latestBlockReceived = receivedBlocks[receivedBlocks.length - 1];
  const latestBlockHeld = blockchain.getLatestBlock();

  if (latestBlockReceived.index > latestBlockHeld.index) {
    console.log('blockchain possibly behind. We got: ' + latestBlockHeld.index + ' Peer got: ' + latestBlockReceived.index);
    if (latestBlockHeld.hash === latestBlockReceived.previousHash) {
      console.log('We can append the received block to our chain');
      blockchain.addBlock(latestBlockReceived);
      broadcast(responseLatestMsg(blockchain));
    } else if (receivedBlocks.length === 1) {
      console.log('We have to query the chain from our peer');
      broadcast(queryAllMsg());
    } else {
      console.log('Received blockchain is longer than current blockchain');
      blockchain.replaceChain(receivedBlocks);
    }
  } else {
    console.log('received blockchain is not longer than current blockchain. Do nothing');
  }
};

const initErrorHandler = (ws) => {
  const closeConnection = (ws) => {
    console.log('connection failed to peer: ' + ws.url);
    sockets.splice(sockets.indexOf(ws), 1);
  };
  ws.on('close', () => closeConnection(ws));
  ws.on('error', () => closeConnection(ws));
};

const connectToPeers = (newPeers, blockchain) => {
  newPeers.forEach((peer) => {
    const ws = new WebSocket(peer);
    ws.on('open', () => initConnection(ws, blockchain));
    ws.on('error', () => {
      console.log('connection failed');
    });
  });
};

// Broadcasts a message to all connected peers.
const broadcast = (message) => sockets.forEach((socket) => write(socket, message));

module.exports = { initP2PServer, connectToPeers, broadcast, responseLatestMsg, sockets };

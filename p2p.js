// const { initP2PServer, connectToPeers, broadcast, responseLatestMsg, blockchain, sockets } = require('./p2p');
const WebSocket = require('ws');
const MessageType = {
  QUERY_LATEST: 0,
  QUERY_ALL: 1,
  RESPONSE_BLOCKCHAIN: 2
};

let blockchain;
const sockets = [];

const initP2PServer = (p2pPort, chain) => {
  blockchain = chain;
  const server = new WebSocket.Server({ port: p2pPort });
  server.on('connection', (ws) => initConnection(ws));
  console.log('listening websocket p2p port on: ' + p2pPort);
};

const initConnection = (ws) => {
  sockets.push(ws);
  initMessageHandler(ws);
  initErrorHandler(ws);
  write(ws, queryChainLengthMsg());

  ws.on('message', (data) => {
    const message = JSON.parse(data);
    switch (message.type) {
      case MessageType.QUERY_LATEST:
        write(ws, responseLatestMsg());
        break;
      case MessageType.QUERY_ALL:
        write(ws, responseChainMsg());
        break;
      case MessageType.RESPONSE_BLOCKCHAIN:
        handleBlockchainResponse(message);
        break;
    }
  });
};

const JSONToObject = (data) => JSON.parse(data);

const initMessageHandler = (ws) => {
  ws.on('message', (data) => {
    const message = JSONToObject(data);
    switch (message.type) {
      case MessageType.QUERY_LATEST:
        write(ws, responseLatestMsg());
        break;
      case MessageType.QUERY_ALL:
        write(ws, responseChainMsg());
        break;
      case MessageType.RESPONSE_BLOCKCHAIN:
        handleBlockchainResponse(message);
        break;
    }
  });
};

const write = (ws, message) => ws.send(JSON.stringify(message));

const queryChainLengthMsg = () => ({ type: MessageType.QUERY_LATEST });
const queryAllMsg = () => ({ type: MessageType.QUERY_ALL });
const responseChainMsg = () => ({
  type: MessageType.RESPONSE_BLOCKCHAIN,
  data: JSON.stringify(blockchain.chain)
});
const responseLatestMsg = () => ({
  type: MessageType.RESPONSE_BLOCKCHAIN,
  data: JSON.stringify([blockchain.getLatestBlock()])
});

const handleBlockchainResponse = (message) => {
  const receivedBlocks = JSONToObject(message.data).sort((b1, b2) => b1.index - b2.index);
  const latestBlockReceived = receivedBlocks[receivedBlocks.length - 1];
  const latestBlockHeld = blockchain.getLatestBlock();

  if (latestBlockReceived.index > latestBlockHeld.index) {
    console.log('blockchain possibly behind. We got: ' + latestBlockHeld.index + ' Peer got: ' + latestBlockReceived.index);
    if (latestBlockHeld.hash === latestBlockReceived.previousHash) {
      console.log('We can append the received block to our chain');
      blockchain.addBlock(latestBlockReceived);
      broadcast(responseLatestMsg());
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

const connectToPeers = (newPeers) => {
  newPeers.forEach((peer) => {
    const ws = new WebSocket(peer);
    ws.on('open', () => initConnection(ws));
    ws.on('error', () => {
      console.log('connection failed');
    });
  });
};

const broadcast = (message) => sockets.forEach((socket) => write(socket, message));

module.exports = { initP2PServer, connectToPeers, broadcast, responseLatestMsg, sockets };
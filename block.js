const CryptoJS = require('crypto-js');

class Block {
  constructor(index, previousHash, timestamp, data, hash, nonce) {
    this.index = index;
    this.previousHash = previousHash.toString();
    this.timestamp = timestamp;
    this.data = data;
    this.hash = hash.toString();
    this.nonce = nonce;
  }
}

const calculateHash = (index, previousHash, timestamp, data, nonce) => {
  return CryptoJS.SHA256(index + previousHash + timestamp + data + nonce).toString();
};

const calculateHashForBlock = (block) => {
  return calculateHash(block.index, block.previousHash, block.timestamp, block.data, block.nonce);
};

const generateNextBlock = (blockchain, blockData) => {
  const previousBlock = blockchain[blockchain.length - 1];
  const nextIndex = previousBlock.index + 1;
  const nextTimestamp = new Date().getTime() / 1000;
  let nonce = 0;
  let nextHash = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData, nonce);

  while (nextHash.substring(0, 4) !== '0000') {
    nonce++;
    nextHash = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData, nonce);
  }

  return new Block(nextIndex, previousBlock.hash, nextTimestamp, blockData, nextHash, nonce);
};

module.exports = {
  Block,
  calculateHash,
  calculateHashForBlock,
  generateNextBlock
};

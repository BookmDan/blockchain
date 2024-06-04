const CryptoJS = require('crypto-js');

/**
 * Represents a block in the blockchain.
 */
class Block {
  // Creates a new block 
  constructor(index, previousHash, timestamp, data, hash, nonce) {
    this.index = index;
    this.previousHash = previousHash ? previousHash.toString() : ''; // Ensure previousHash is not undefined
    this.timestamp = timestamp;
    this.data = data;
    this.hash = hash ? hash.toString() : ''; // Ensure hash is not undefined
    this.nonce = nonce;
  }
}

// Calculates the SHA-256 hash for given block parameters
const calculateHash = (index, previousHash, timestamp, data, nonce) => {
  return CryptoJS.SHA256(index + previousHash + timestamp + data + nonce).toString();
};

const calculateHashForBlock = (block) => {
  return calculateHash(block.index, block.previousHash, block.timestamp, block.data, block.nonce);
};

const generateNextBlock = (blockchain, blockData) => {
  const previousBlock = blockchain[blockchain.length - 1];
  if (!previousBlock) {
      throw new Error("Previous block is undefined");
  }
  const nextIndex = previousBlock.index + 1;
  const nextTimestamp = new Date().getTime() / 1000;
  let nonce = 0;
  let nextHash = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData, nonce);

  // Proof-of-Work: find a hash that meets the difficulty target
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

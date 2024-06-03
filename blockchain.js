const { Block, calculateHash, calculateHashForBlock, generateNextBlock } = require('./block');

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, "0", 1465154705, "Genesis Block", "816534932c2b5e1f41251b7a931533dc29c7d82cf74df9e8871d43c3e8cf88b4", 0);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    if (this.isValidNewBlock(newBlock, this.getLatestBlock())) {
      this.chain.push(newBlock);
    }
  }

  isValidNewBlock(newBlock, previousBlock) {
    if (previousBlock.index + 1 !== newBlock.index) {
      console.log('invalid index');
      return false;
    } else if (previousBlock.hash !== newBlock.previousHash) {
      console.log('invalid previoushash');
      return false;
    } else if (calculateHashForBlock(newBlock) !== newBlock.hash) {
      console.log('invalid hash: ' + calculateHashForBlock(newBlock) + ' ' + newBlock.hash);
      return false;
    }
    return true;
  }

  isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(this.createGenesisBlock())) {
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      if (!this.isValidNewBlock(chain[i], chain[i - 1])) {
        return false;
      }
    }

    return true;
  }

  replaceChain(newChain) {
    if (this.isValidChain(newChain) && newChain.length > this.chain.length) {
      console.log('Received blockchain is valid. Replacing current blockchain with received blockchain');
      this.chain = newChain;
    } else {
      console.log('Received blockchain invalid');
    }
  }
}

module.exports = Blockchain;

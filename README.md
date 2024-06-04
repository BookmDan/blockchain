Blockchain Implementation Summary Report 
June 4, 2024 
Daniel Oh 
Resources: https://tinyurl.com/LauriHartikkaMediumpost , https://github.com/lhartikk/naivechain

## Task: 
• A summary of how you implemented the blockchain and how to use it. <br>
• Any challenges you faced and how you overcame them.

## Summary of Implementation:
Lauri’s “A blockchain in 200 lines of code” was definitely a great starting point for my implementation. The core component I integrated was the proof-of-work mechanism, as outlined in the assignment guidelines. 

We first set the difficulty target of 4, meaning the hash must start with 4 zeros. 
Then as part of the of mining process, we first calculate the hash, generating the hash of the block by including the index, previous hash, timestamp, data, and nonce. Then we increment the nonce value and recalculate the hash until we find a hash that meets the difficulty target requirement. 
Once a valid nonce (number used only once)  is found, the block is considered mined, and its hash is recorded. This hash is included in the next block, linking the blocks.

Key methods such as addPeer, connectToPeers, and broadcast were pivotal for facilitating network communication and synchronization.

## How to start the code: 
To start the server using Node.js, the command

`node server.js`

is executed. 

Then to retrieve the blockchain by sending a GET request to ‘/blocks’. This is where we do the sanity check to make sure that all the blockchains have the same data: 

`curl http://localhost:3001/blocks`

To add a peer, we use the following command: 

`curl -X POST -H "Content-Type: application/json" -d '{"peer":"ws://localhost:6002"}' http://localhost:3001/addPeer`

To mine a new block, we use this command: 

`curl -X POST -H "Content-Type: application/json" -d '{"data":"Malfoy 2024-06-02"}' http://localhost:3001/mineBlock`

## Challenges I faced: 
One of the challenges early on that I faced was this error message below: 
![Screenshot 2024-06-04 at 11 07 19 AM (2)](https://github.com/BookmDan/blockchain/assets/8926023/c7ffebd1-04fb-4d5b-b04d-cd22d9653cba)


I thought I had forgot to initialize blockchain object. But actually the issue was that I was not passing blockchain as a parameter in my P2P.js methods for initConnection, initP2PServer, etc. 

Passing blockchain instance as a parameter was important because it ensured that my application has access to the same blockchain data. By not passing the blockchain instance, I was not passing to the methods like getLatestBlock, for example, access to the current state of the blockchain leading to errors like the ‘Cannot read properties of undefined’. 

![Screenshot 2024-06-04 at 11 10 59 AM (2)](https://github.com/BookmDan/blockchain/assets/8926023/1b928ac4-e70d-4b6a-9ef6-a54a55347d3e)

## Recording Demo: 
https://www.awesomescreenshot.com/video/28324895

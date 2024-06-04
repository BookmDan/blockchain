Blockchain Implementation Summary Report 
June 4, 2024 
Daniel Oh 
Resources: [Lauri Hartikka's Medium post](https://website-name.com](https://medium.com/@lhartikk/a-blockchain-in-200-lines-of-code-963cc1cc0e54#id_token=eyJhbGciOiJSUzI1NiIsImtpZCI6IjY3NGRiYmE4ZmFlZTY5YWNhZTFiYzFiZTE5MDQ1MzY3OGY0NzI4MDMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyMTYyOTYwMzU4MzQtazFrNnFlMDYwczJ0cDJhMmphbTRsamRjbXMwMHN0dGcuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyMTYyOTYwMzU4MzQtazFrNnFlMDYwczJ0cDJhMmphbTRsamRjbXMwMHN0dGcuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTIzMTM2NjY3MDU2NzA3NTk2MjIiLCJlbWFpbCI6ImRhbm9oMzI5QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYmYiOjE3MTczODU1NjIsIm5hbWUiOiJEYW5pZWwgTyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLQ0dXSHVSREdMZG1uOEdEcFJrQkE2d0MwWTBPN3FTSEk1bjF2b0w3aVQzVXZiWFlfSXBRPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IkRhbmllbCIsImZhbWlseV9uYW1lIjoiTyIsImlhdCI6MTcxNzM4NTg2MiwiZXhwIjoxNzE3Mzg5NDYyLCJqdGkiOiJhYzdmMzllMDlmMzFlN2U2MTMzYzI1NWI1NmI3OTY3YjBlYzg2YmE0In0.FQkkPTYYrYr3uB_eh_mynr1-_U3gwcULpMkjAF4qqWrJrIoxdh2esaCuGoOh9IBh8MPLLpkqLrLa6k6eLVoXlpXgZfxvm375w87lWiv-D1NM5HwLgn4scgFKgXJBQe9sV0XBkbLvuSZ1z263bQpA5MuXFu-elTPFp6NWSMx-WAu_fol7ux4lwUavJ-Tpxw7ATp1tE4PmEUvFCNWt1ZZsDoHFnnT9y-sj_9UrxIYtbsEEyG-TZWIK5MEEgfGdsi1nobOyFQng1MExk2ww4vdSUhXTdgzIX41zVXYRoD6ajeCBt8-rmJn_ngbe_nzy2AYsglzDETFCTlKlYvzNMKDxKg) , https://github.com/lhartikk/naivechain

Task: 
• A summary of how you implemented the blockchain and how to use it.
• Any challenges you faced and how you overcame them.

Summary of Implementation:
Lauri’s “A blockchain in 200 lines of code” was definitely a great starting point for my implementation. The core component I integrated was the proof-of-work mechanism, as outlined in the assignment guidelines. 

We first set the difficulty target of 4, meaning the hash must start with 4 zeros. 
Then as part of the of mining process, we first calculate the hash, generating the hash of the block by including the index, previous hash, timestamp, data, and nonce. Then we increment the nonce value and recalculate the hash until we find a hash that meets the difficulty target requirement. 
Once a valid nonce (number used only once)  is found, the block is considered mined, and its hash is recorded. This hash is included in the next block, linking the blocks.

Key methods such as addPeer, connectToPeers, and broadcast were pivotal for facilitating network communication and synchronization.

To start the server using Node.js, the command

node server.js 

is executed. 

Then to retrieve the blockchain by sending a GET request to ‘/blocks’. This is where we do the sanity check to make sure that all the blockchains have the same data: 

curl http://localhost:3001/blocks

To add a peer, we use the following command: 

curl -X POST -H "Content-Type: application/json" -d '{"peer":"ws://localhost:6002"}' http://localhost:3001/addPeer

To mine a new block, we use this command: 

curl -X POST -H "Content-Type: application/json" -d '{"data":"Malfoy 2024-06-02"}' http://localhost:3001/mineBlock



One of the challenges early on that I faced was this error message below: 


I thought I had forgot to initialize blockchain object. But actually the issue was that I was not passing blockchain as a parameter in my P2P.js methods for initConnection, initP2PServer, etc. 

Passing blockchain instance as a parameter was important because it ensured that my application has access to the same blockchain data. By not passing the blockchain instance, I was not passing to the methods like getLatestBlock, for example, access to the current state of the blockchain leading to errors like the ‘Cannot read properties of undefined’. 



Recording Demo: 
https://www.awesomescreenshot.com/video/28324895

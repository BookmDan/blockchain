const axios = require('axios');

const http_port = process.env.HTTP_PORT || 3001;

const getBlocks = async () => {
  try {
    const response = await axios.get(`http://localhost:${http_port}/blocks`);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

const mineBlock = async (data) => {
  try {
    await axios.post(`http://localhost:${http_port}/mineBlock`, { data });
    console.log('Block mined successfully');
  } catch (error) {
    console.error(error);
  }
};

const addPeer = async (peer) => {
  try {
    await axios.post(`http://localhost:${http_port}/addPeer`, { peer });
    console.log('Peer added successfully');
  } catch (error) {
    console.error(error);
  }
};

// Example usage:
getBlocks();
mineBlock('Some data');
addPeer('ws://localhost:6001');

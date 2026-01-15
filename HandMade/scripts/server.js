const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Sửa lại route API
server.use('/api', router);

// KHÔNG sử dụng listen() trong server.js
// Vercel sẽ tự động handle

module.exports = server;
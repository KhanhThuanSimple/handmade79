const jsonServer = require('json-server');
const path = require('path');
const server = jsonServer.create();

// Sử dụng path.join và __dirname để đảm bảo luôn tìm thấy file db.json 
// dù deploy ở bất cứ đâu trên server Vercel
const dbPath = path.join(__dirname, 'db.json');
const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

module.exports = server;
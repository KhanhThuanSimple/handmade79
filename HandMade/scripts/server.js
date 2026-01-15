const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);

// API chỉ chạy dưới /api
server.use('/api', router);

server.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = server;

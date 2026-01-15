const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// API
server.use('/api', router);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 API running at http://localhost:${PORT}`);
});

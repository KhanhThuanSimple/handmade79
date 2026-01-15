const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
// Quan trọng: Thêm rewrite để route đúng vào router của json-server
server.use(jsonServer.rewriter({
  '/api/*': '/$1'
}));
server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running');
});

module.exports = server;
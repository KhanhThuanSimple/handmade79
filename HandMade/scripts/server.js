const jsonServer = require('json-server');
const path = require('path');
const server = jsonServer.create();

// Phải dùng path.join để Vercel tìm thấy file db.json trong thư mục build
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Rewrite để hỗ trợ các route như /products
server.use(jsonServer.rewriter({
  "/api/*": "/$1"
}));

server.use(router);

// QUAN TRỌNG: Không dùng server.listen() ở đây khi deploy lên Vercel
// Xuất server ra để Vercel xử lý
module.exports = server;
const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Health check
server.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
});

// API routes
server.use('/api', router);

// Error handling
server.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = server;
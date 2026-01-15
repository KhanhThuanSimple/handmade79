const db = require('../db.json');

module.exports = async (req, res) => {
  // Set headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  const path = req.url.split('?')[0];
  
  switch (path) {
    case '/':
    case '/health':
      return res.json({ 
        status: 'ok', 
        message: 'HandMade79 API - Read Only',
        endpoints: [
          '/products',
          '/categories', 
          '/users',
          '/reviews',
          '/vouchers'
        ]
      });
      
    case '/products':
      return handleProducts(req, res);
      
    case '/categories':
      return res.json(db.categories || []);
      
    case '/users':
      return res.json(db.users || []);
      
    case '/reviews':
      return res.json(db.reviews || []);
      
    case '/vouchers':
      return res.json(db.voucher || []);
      
    case '/orders':
      return res.json(db.orders || []);
      
    default:
      // Nếu không match, trả về 404
      return res.status(404).json({ error: 'Endpoint not found', path });
  }
};

function handleProducts(req, res) {
  let products = db.products || [];
  const query = req.query;
  
  // Filter by category
  if (query.category) {
    products = products.filter(p => 
      p.categoryId == query.category || 
      p.category === query.category
    );
  }
  
  // Filter by search
  if (query.search) {
    const term = query.search.toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(term) ||
      (p.description && p.description.toLowerCase().includes(term))
    );
  }
  
  // Filter by price range
  if (query.minPrice) {
    products = products.filter(p => p.price >= parseInt(query.minPrice));
  }
  if (query.maxPrice) {
    products = products.filter(p => p.price <= parseInt(query.maxPrice));
  }
  
  // Pagination
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const result = {
    page,
    limit,
    total: products.length,
    totalPages: Math.ceil(products.length / limit),
    data: products.slice(startIndex, endIndex)
  };
  
  return res.json(result);
}
const TTL = 60 * 1000; // 1 minute

// key -> { data, createdAt }
const cache = new Map();

function cacheMiddleware(req, res, next) {
  const key = req.originalUrl;
  const entry = cache.get(key);

  if (entry) {
    const age = Date.now() - entry.createdAt;
    if (age < TTL) {
      res.set('X-Cache', 'HIT');
      return res.status(200).json(entry.data);
    }
    // Expired: do not use it, remove it
    cache.delete(key);
  }

  res.set('X-Cache', 'MISS');

  // Intercept res.json so we can store the fresh response in the cache
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode === 200) {
      cache.set(key, { data: body, createdAt: Date.now() });
    }
    return originalJson(body);
  };

  next();
}

// Used on POST / PUT / PATCH / DELETE.
// Clears the whole cache only if the request succeeded (2xx).
function invalidateCache(req, res, next) {
  res.on('finish', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      cache.clear();
    }
  });
  next();
}

module.exports = { cacheMiddleware, invalidateCache };
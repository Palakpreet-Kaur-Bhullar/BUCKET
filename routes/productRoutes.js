const express = require('express');
const controller = require('../controllers/productController');
const { cacheMiddleware, invalidateCache } = require('../middleware/cache');

const router = express.Router();

// Reads: cached
router.get('/', cacheMiddleware, controller.getAllProducts);
router.get('/:id', cacheMiddleware, controller.getProductById);

// Writes: invalidate cache when they succeed
router.post('/', invalidateCache, controller.createProduct);
router.put('/:id', invalidateCache, controller.updateProduct);
router.patch('/:id', invalidateCache, controller.patchProduct);
router.delete('/:id', invalidateCache, controller.deleteProduct);

module.exports = router;
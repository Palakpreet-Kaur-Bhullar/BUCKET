const express = require('express')
const controller = require('../controllers/productController')
const { checkCache, clearCache } = require('../middleware/cache')

const router = express.Router()

router.get('/', checkCache, controller.getAllProducts)
router.get('/:id', checkCache, controller.getProductById)

router.post('/', clearCache, controller.addProduct)
router.put('/:id', clearCache, controller.updateProduct)
router.patch('/:id', clearCache, controller.patchProduct)
router.delete('/:id', clearCache, controller.deleteProduct)

module.exports = router
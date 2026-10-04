const productService = require('../services/productService')

async function getAllProducts(req, res) {
    try {
        const products = await productService.getAllProducts()
        res.json(products)
    } catch (err) {
        res.status(500).json({ error: 'Error in reading file' })
    }
}

async function getProductById(req, res) {
    try {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'Invalid id' })
        }

        const product = await productService.getProductById(id)
        if (!product) {
            return res.status(404).json({ error: 'Element not found' })
        }
        res.json(product)
    } catch (err) {
        res.status(500).json({ error: 'Error in reading file' })
    }
}

async function addProduct(req, res) {
    try {
        const { name, price } = req.body
        if (!name || price === undefined) {
            return res.status(400).json({ error: 'name and price are required' })
        }

        const newProduct = await productService.addProduct(name, price)
        res.status(201).json(newProduct)
    } catch (err) {
        res.status(500).json({ error: 'Error in writing file' })
    }
}

async function updateProduct(req, res) {
    try {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'Invalid id' })
        }

        const { name, price } = req.body
        if (!name || price === undefined) {
            return res.status(400).json({ error: 'name and price are required' })
        }

        const product = await productService.updateProduct(id, name, price)
        if (!product) {
            return res.status(404).json({ error: 'Element not found' })
        }
        res.json(product)
    } catch (err) {
        res.status(500).json({ error: 'Error in writing file' })
    }
}

async function patchProduct(req, res) {
    try {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'Invalid id' })
        }

        const { name, price } = req.body
        if (name === undefined && price === undefined) {
            return res.status(400).json({ error: 'Provide name or price' })
        }

        const product = await productService.patchProduct(id, name, price)
        if (!product) {
            return res.status(404).json({ error: 'Element not found' })
        }
        res.json(product)
    } catch (err) {
        res.status(500).json({ error: 'Error in writing file' })
    }
}

async function deleteProduct(req, res) {
    try {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'Invalid id' })
        }

        const isDeleted = await productService.deleteProduct(id)
        if (!isDeleted) {
            return res.status(404).json({ error: 'Element not found' })
        }
        res.json({ message: 'Deleted' })
    } catch (err) {
        res.status(500).json({ error: 'Error in writing file' })
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    patchProduct,
    deleteProduct
}
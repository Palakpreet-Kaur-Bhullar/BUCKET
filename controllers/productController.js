const productService = require('../services/productService');

function parseId(req, res) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'Invalid id' });
    return null;
  }
  return id;
}

async function getAllProducts(req, res) {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error in reading file' });
  }
}

async function getProductById(req, res) {
  try {
    const id = parseId(req, res);
    if (id === null) return;

    const product = await productService.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: 'Element not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error in reading file' });
  }
}

async function createProduct(req, res) {
  try {
    const { name, price } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ error: 'name and price are required' });
    }
    const created = await productService.createProduct({ name, price });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'Error in writing file' });
  }
}

// PUT = full replacement
async function updateProduct(req, res) {
  try {
    const id = parseId(req, res);
    if (id === null) return;

    const { name, price } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ error: 'name and price are required' });
    }

    const updated = await productService.updateProduct(id, { name, price });
    if (!updated) {
      return res.status(404).json({ error: 'Element not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error in writing file' });
  }
}

// PATCH = partial update
async function patchProduct(req, res) {
  try {
    const id = parseId(req, res);
    if (id === null) return;

    const { name, price } = req.body;
    if (name === undefined && price === undefined) {
      return res.status(400).json({ error: 'Provide name and/or price' });
    }

    const updated = await productService.patchProduct(id, { name, price });
    if (!updated) {
      return res.status(404).json({ error: 'Element not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error in writing file' });
  }
}

async function deleteProduct(req, res) {
  try {
    const id = parseId(req, res);
    if (id === null) return;

    const deleted = await productService.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Element not found' });
    }
    res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error in writing file' });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
};
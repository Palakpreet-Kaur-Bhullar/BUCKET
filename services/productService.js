const db = require('../database/db');

async function getAllProducts() {
  return db.readProducts();
}

async function getProductById(id) {
  const products = await db.readProducts();
  return products.find((p) => p.id === id) || null;
}

async function createProduct({ name, price }) {
  const products = await db.readProducts();
  // max id + 1 (length + 1 can create duplicate ids after a delete)
  const nextId = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
  const product = { id: nextId, name, price };
  products.push(product);
  await db.writeProducts(products);
  return product;
}

async function updateProduct(id, { name, price }) {
  const products = await db.readProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  products[index] = { id, name, price };
  await db.writeProducts(products);
  return products[index];
}

async function patchProduct(id, fields) {
  const products = await db.readProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  if (fields.name !== undefined) products[index].name = fields.name;
  if (fields.price !== undefined) products[index].price = fields.price;

  await db.writeProducts(products);
  return products[index];
}

async function deleteProduct(id) {
  const products = await db.readProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return false;

  products.splice(index, 1);
  await db.writeProducts(products);
  return true;
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
};
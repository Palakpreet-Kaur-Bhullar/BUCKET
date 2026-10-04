const fs = require('fs/promises');
const path = require('path');

// db.json lives in the project root, one level above /database
const pathToDb = path.join(__dirname, '..', 'db.json');

// Simulates a slow database so cache HIT vs MISS is easy to see
function delay() {
  return new Promise((resolve) => setTimeout(resolve, 2000));
}

async function readProducts() {
  await delay();
  const content = await fs.readFile(pathToDb, 'utf-8');
  return JSON.parse(content);
}

async function writeProducts(products) {
  await fs.writeFile(pathToDb, JSON.stringify(products, null, 2));
}

module.exports = { readProducts, writeProducts };
const db = require('../database/db')

async function getAllProducts() {
    return await db.getProducts()
}

async function getProductById(id) {
    const products = await db.getProducts()
    const found = products.find((item) => item.id === id)
    return found || null
}

async function addProduct(name, price) {
    const products = await db.getProducts()

    let newId = 1
    if (products.length > 0) {
        newId = Math.max(...products.map((item) => item.id)) + 1
    }

    const newProduct = { id: newId, name: name, price: price }
    products.push(newProduct)
    await db.saveProducts(products)
    return newProduct
}

async function updateProduct(id, name, price) {
    const products = await db.getProducts()
    const index = products.findIndex((item) => item.id === id)
    if (index === -1) {
        return null
    }

    products[index] = { id: id, name: name, price: price }
    await db.saveProducts(products)
    return products[index]
}

async function patchProduct(id, name, price) {
    const products = await db.getProducts()
    const index = products.findIndex((item) => item.id === id)
    if (index === -1) {
        return null
    }

    if (name !== undefined) {
        products[index].name = name
    }
    if (price !== undefined) {
        products[index].price = price
    }

    await db.saveProducts(products)
    return products[index]
}

async function deleteProduct(id) {
    const products = await db.getProducts()
    const index = products.findIndex((item) => item.id === id)
    if (index === -1) {
        return false
    }

    products.splice(index, 1)
    await db.saveProducts(products)
    return true
}

module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    patchProduct,
    deleteProduct
}
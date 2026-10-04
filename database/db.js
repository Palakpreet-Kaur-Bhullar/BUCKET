const fs = require('fs/promises')
const path = require('path')

const pathToDb = path.join(__dirname, '..', 'db.json')

function delay() {
    return new Promise((resolve) => {
        setTimeout(resolve, 2000)
    })
}

async function getProducts() {
    await delay()
    const content = await fs.readFile(pathToDb, 'utf-8')
    return JSON.parse(content)
}

async function saveProducts(products) {
    await fs.writeFile(pathToDb, JSON.stringify(products, null, 2))
}

module.exports = { getProducts, saveProducts }
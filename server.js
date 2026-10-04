const express= require('express')
const app = express()
app.use(express.json())

const fs = require('fs/promises')
const path = require('path')
const { pathToFileURL } = require('url')
const pathToDb = path.join(__dirname,'db.json')
function delay(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve()
        },2000)
    })
}
let cache = {}

app.get('/products',async (req,res)=>{
    if(!cache.products){
        await delay()
        let content = await fs.readFile(pathToDb,'utf-8')
        content = JSON.parse(content)
        cache.products = content
    }
    res.json(cache.products)
})
app.get('/products/:id',async (req,res)=>{
    try{
        let Id = Number(req.params.id)
        if(!cache[`products_${Id}`]){
            await delay()
            let content = await fs.readFile(pathToDb,'utf-8')
            content = JSON.parse(content)
            const found = content.find((obj)=>{
                return obj.id == Id
            })
            if(!found){
                res.status(404).json({
                    "error":"ELement not found"
                })
                return
            }
            cache[`products_${Id}`] = found
        }
        res.json(cache[`products_${Id}`])
    }
    catch(err){
        res.status(500).json({
            "error":"Error in reading file"
        })
        return
    }
})
app.post('/products',async (req,res)=>{
    let postedData = req.body
    let content;
    if(!cache.products){
        content = await fs.readFile(pathToDb,'utf-8')
        content = JSON.parse(content)
    }else{
        content = cache.products
    }
    content.push({
        id: content.length +1 , 
        name: postedData.name,
        price: postedData.price
    })
    fs.writeFileSync(pathToDb,JSON.stringify(content))
    cache.products = null
    res.status(201).send("created")
})

app.listen(3000)
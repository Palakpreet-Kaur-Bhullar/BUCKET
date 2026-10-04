const ONE_MINUTE = 60 * 1000

let cache = {}
let version = 0

function checkCache(req, res, next) {
    const key = req.originalUrl
    const saved = cache[key]

    if (saved && Date.now() - saved.time < ONE_MINUTE) {
        res.set('X-Cache', 'HIT')
        return res.status(200).json(saved.data)
    }

    if (saved) {
        delete cache[key]
    }

    res.set('X-Cache', 'MISS')

    const startVersion = version
    const sendJson = res.json.bind(res)

    res.json = (data) => {
        if (res.statusCode === 200 && startVersion === version) {
            cache[key] = { data: data, time: Date.now() }
        }
        return sendJson(data)
    }

    next()
}

function clearCache(req, res, next) {
    res.on('finish', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            version++
            cache = {}
        }
    })
    next()
}

module.exports = { checkCache, clearCache }
// server.js
const jsonServer = require('json-server')
const server = jsonServer.create()
const path = require('path')
const fs = require('fs')
const middlewares = jsonServer.defaults()

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// Load data
const data = []
data.push(JSON.parse(fs.readFileSync(path.join(__dirname, 'data/comments.json'))))
data.push(JSON.parse(fs.readFileSync(path.join(__dirname, 'data/profile.json'))))
data.push(JSON.parse(fs.readFileSync(path.join(__dirname, 'data/posts.json'))))
const router = jsonServer.router(Object.assign({}, ...data))
server.use(router)

const PORT = 3001
server.listen(PORT, () => {
  console.log('JSON Server is running')
  console.log('-'.repeat(10))
  console.log(`http://localhost:${PORT}`)
  console.log('-'.repeat(10))
})

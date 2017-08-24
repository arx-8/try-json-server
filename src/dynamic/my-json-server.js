/**
 * ***必須処理順番***
 * - rewriter
 * - custom routes
 * - body-parser
 */
const jsonServer = require('json-server')
const server = jsonServer.create()
const filePath = require('path')
const fs = require('fs')
const middlewares = jsonServer.defaults()

// カスタム遅延
server.use(function (req, res, next) {
  setTimeout(next, 3000);
});

// 制約としてリソースパスにスラッシュを含めることが出来ないため、ルータファイルを使って書き換える
// jsonのフォーマットは、key:書換パス, value:実際の宛先
const ROUTER_FILE_NAME = 'routers.json'
const routerJson = JSON.parse(fs.readFileSync(filePath.join(__dirname, ROUTER_FILE_NAME)))
server.use(jsonServer.rewriter(routerJson))

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// データDir配下のJSONは全てダミーAPI用のJSONとして読み込む
const JSON_EXTENSION = /.*\.json$/
const DATA_DIR_RELATIVE_PATH = 'data'
const getDataFilePaths = () => {
  const fileNames = fs.readdirSync(filePath.join(__dirname, DATA_DIR_RELATIVE_PATH))
  const filePaths = fileNames
    .filter((fileName) => JSON_EXTENSION.test(fileName))
    .map((fileName) => filePath.join(__dirname, DATA_DIR_RELATIVE_PATH, fileName))
  return filePaths
}
const filePaths = getDataFilePaths()
const jsonObjs = filePaths.map((filePath) => JSON.parse(fs.readFileSync(filePath)))
const router = jsonServer.router(Object.assign({}, ...jsonObjs))
server.use(router)

// ダミーAPIサーバ起動
const PORT = 3001
server.listen(PORT, () => {
  console.log('JSON Server is running')
  console.log('-'.repeat(30))
  console.log(`http://localhost:${PORT}`)
  console.log('-'.repeat(30))
})

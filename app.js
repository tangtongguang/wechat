const Koa = require('koa')
const logger = require('koa-logger')
const compress = require('koa-compress')
const bodyParser = require('koa-bodyparser')
const appConfig = require('./app.config')
const middles = require('./middleWares')
const router = require('./router')

const app = new Koa()

// 配置中间件，通过 bodyParser 获取 post 请求传递过来的参数
app.use(bodyParser())

app.use(logger())
app.use(compress({
    threshold: 1024 // 超过大小即压缩，bytes
}))

// 启动自定义中间件
middles(app)

// 启动路由
router(app)

// app错误监听
app.on('error', (err) => {
    console.error('Server error: \n%s\n%s ', err.stack || '')
})

app.listen(appConfig.appPort, () => {
    console.log(`app runs on port ${appConfig.appPort}`)
})
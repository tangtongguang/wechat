/**
 * 模块化处理router
 */
const Router = require('koa-router')
const sha1 = require('sha1')
const appConfig = require('../app.config')

const router = new Router()

/**
 * 启动路由
 * allowedMethods, 在所有路由中间件最后调用, 此时根据 ctx.status 设置 response 响应头
 */
module.exports = app => {
    // 验证消息的确来自微信服务器
    router.get('/', ctx => {
        const { openid } = ctx.query
        if (openid) { // 用户给公众号发消息
            return ctx.body = ''
        }
        const { signature, timestamp, nonce, echostr } = ctx.query
        let str = [appConfig.Token, timestamp, nonce].sort().join('') // 按字典排序，拼接字符串
        let sha = sha1(str)
        ctx.body = (sha === signature) ? echostr : ''
    })

    app.use(router.routes(), router.allowedMethods())
}
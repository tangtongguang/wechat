/**
 * 模块化处理router
 */
const Router = require('koa-router')
const sha1 = require('sha1')
const appConfig = require('../app.config')
const sign = require('../utils/wechat/sign')
const getAccessToken = require('../utils/wechat/getAccessToken')
const getJsapiTicket = require('../utils/wechat/getJsapiTicket')

// 获取微信鉴权信息
// async getConfig () {
//   
//   console.log(config)
// }
const router = new Router()




/**
 * 启动路由
 * allowedMethods, 在所有路由中间件最后调用, 此时根据 ctx.status 设置 response 响应头
 */
module.exports = app => {
    // 验证消息的确来自微信服务器
    router.get('/echo', ctx => {
        const { openid } = ctx.query
        if (openid) { // 用户给公众号发消息
            console.log('openid is not null')
            return ctx.body = ''
        }
        const { signature, timestamp, nonce, echostr } = ctx.query
        let str = [appConfig.Token, timestamp, nonce].sort().join('') // 按字典排序，拼接字符串
        let sha = sha1(str)
        console.log(appConfig.appId)
        ctx.body = (sha === signature) ? echostr : ''
        console.log(ctx.body, 'is body')
    })


    router.get('/config', async ctx => {
        let config
        try {
            const jsapiTicket = await getJsapiTicket(await getAccessToken())
            config = sign(appConfig.appId, jsapiTicket, ctx.query.url)
        } catch (error) {
            console.log('error', error)
            config = {}
        }
        ctx.body = config;
    })

    app.use(router.routes(), router.allowedMethods())
}
/**
 * 错误处理中间件，放在所有中间件之前，就可以捕获它们所有的同步或者异步代码中抛出的异常
 * @param  ctx koa ctx
 * @param next koa next 
 */
module.exports = async (ctx, next) => {
    try {
        // Node标识
        ctx.set('X-Proxy', 'Node Server')
        await next()
    } catch (err) {
        console.log('err', err)
        ctx.status = err.status || 500
        ctx.body = 'We are sorry. Internal server error occurred.'
        ctx.app.emit('error', err, ctx)
    }
}
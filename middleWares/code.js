/**
 * ctx code 设置
 * @param  ctx koa ctx
 * @param next koa next 
 */
module.exports = async (ctx, next) => {
    ctx.body = { code: 200, message: '成功' }
    await next()
}

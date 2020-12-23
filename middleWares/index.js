/**
 * @file 中间件集合
 */
const errorMiddleWare = require('./error')
const codeMiddleWare = require('./code')

/**
 * 中间件
 */
module.exports = (app) => {
    // error 放在所有中间件之前，就可以捕获它们所有的同步或者异步代码中抛出的异常
    // codeMiddleWare 放在所有中间件之后
    const middleWares = [errorMiddleWare]

    middleWares.forEach((middleware) => {
        app.use(middleware)
    })
}
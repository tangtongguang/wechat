/**
 * 从这里下载官方示例
 * http://demo.open.weixin.qq.com/jssdk/sample.zip
 * jssha 请用官方示例中的文件
 */

var createNonceStr = function () {
    return Math.random().toString(36).substr(2, 15)
}

var createTimestamp = function () {
    return parseInt(new Date().getTime() / 1000) + ''
}

var raw = function (args) {
    var keys = Object.keys(args)
    keys = keys.sort()
    var newArgs = {}
    keys.forEach(function (key) {
        newArgs[key.toLowerCase()] = args[key]
    })

    var string = ''
    for (var k in newArgs) {
        string += '&' + k + '=' + newArgs[k]
    }
    string = string.substr(1)
    return string
}

/**
* @synopsis 签名算法 
*
* @param appId 应用appId
* @param jsapi_ticket 用于签名的 jsapi_ticket
* @param url 用于签名的 url ，注意必须动态获取，不能 hardcode
*
* @returns
*/
var sign = function (appId, jsapi_ticket, url) {
    let timestamp = createTimestamp()
    let nonceStr = createNonceStr()
    var ret = { appId, jsapi_ticket, nonceStr, timestamp, url }
    var string = raw(ret)
    var jsSHA = require('jssha')
    var shaObj = new jsSHA(string, 'TEXT')
    var signature = shaObj.getHash('SHA-1', 'HEX')

    const config = { appId, timestamp, nonceStr, signature }
    return config
}

module.exports = sign
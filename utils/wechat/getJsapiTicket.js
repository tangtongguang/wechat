/**
 * jsapiTicket 的缓存和更新
 */
const fs = require('fs')
const path = require('path')
const request = require('request')
const appConfig = require('../../app.config')

const fileName = path.resolve(__dirname, './jsapiTicket.json')
let accessTokenTemp, validTime = 7200 // jsapiTicket 的默认有效时间

/**
 * 根据 access_token 获取 jsapiTicket
 * @param {string} accessToken
 */
const getJsapiTicket = async (accessToken) => {
    accessTokenTemp = accessToken
    try {
        let readRes = fs.readFileSync(fileName, 'utf8')
        readRes = JSON.parse(readRes)

        // 如果创建的时间超过现在时间默认 7200ms
        const createTime = new Date(readRes.createTime).getTime()
        const nowTime = new Date().getTime()
        if ((nowTime - createTime) / 1000 >= validTime) {
            await updateJsapiTicket()
            return await getJsapiTicket()
        }

        return readRes.jsapiTicket
    } catch (error) {
        // 未读取到文件中的正确内容则更新接口
        //await updateJsapiTicket()
        //return await getJsapiTicket()
    }
}

// 更新本地缓存的 jsapiTicket
const updateJsapiTicket = async () => {
    const res = JSON.parse(await getNewJsapiTicket())
    if (res.ticket) {
        validTime = res.expires_in
        fs.writeFileSync(fileName, JSON.stringify({ createTime: new Date(), ...res }))
    } else {
        //await updateJsapiTicket()
    }
}


/**
 * 根据 access_token 获取 jsapiTicket
 * @return {Promise}
 */
// 从微信获取新的 jsapiTicket，有效时间默认是 7200ms
const getNewJsapiTicket = async () => {
    console.log('从微信服务器获取 jsapiTicket 啦')
    return new Promise((resolve, reject) => {
        request.get(`${appConfig.wxapiBaseUrl}/ticket/getticket?access_token=${accessTokenTemp}&type=jsapi`, (err, res, body) => {
            if (err) {
                reject('获取 jsapiTicket 失败 检查 getJsapiTicket 函数')
            }
            resolve(body)
        })
    })
}

// jsapiTicket 默认有效时间 7200ms，五分钟交替时间
// setInterval(async () => {
//   await updateJsapiTicket()
// }, (validTime - 300) * 1000)

module.exports = getJsapiTicket
/**
 * access_token 的缓存和更新
 */
const fs = require('fs')
const path = require('path')
const request = require('request')
const appConfig = require('../../app.config')

const fileName = path.resolve(__dirname, './access_token.json')
let validTime = 7200 // access_token 的默认有效时间

/**
 * 通过 appId 和 appSecret 获取 access_token
 * @return {Promise}
 */
const getAccessToken = async () => {
    try {
        let readRes = fs.readFileSync(fileName, 'utf8')
        readRes = JSON.parse(readRes)

        // 如果创建的时间超过现在时间默认 7200ms
        const createTime = new Date(readRes.createTime).getTime()
        const nowTime = new Date().getTime()
        if ((nowTime - createTime) / 1000 >= validTime) {
            await updateAccessToken()
            return await getAccessToken()
        }

        return readRes.access_token
    } catch (error) {
        // 未读取到文件中的正确内容则更新接口
        await updateAccessToken()
        return await getAccessToken()
    }
}

// 更新本地缓存的 access_token
const updateAccessToken = async () => {
    const res = JSON.parse(await getNewAccessToken())
    if (res.access_token) {
        validTime = res.expires_in
        fs.writeFileSync(fileName, JSON.stringify({ createTime: new Date(), ...res }))
    } else {
        await updateAccessToken()
    }
}

// 从微信获取新的 access_token，有效时间默认是 7200ms
const getNewAccessToken = async () => {
    console.log('从微信服务器获取 access_token 啦')
    return new Promise((resolve, reject) => {
        request.get(`${appConfig.wxapiBaseUrl}/token?grant_type=client_credential&appId=${appConfig.appId}&secret=${appConfig.appSecret}`, (err, res, body) => {
            if (err) {
                reject('获取 access_token 失败 检查 getAccessToken 函数')
            }
            resolve(body)
        })
    })
}

// access_token 默认有效时间 7200ms，五分钟交替时间
// setInterval(async () => {
//     await updateAccessToken()
// }, (validTime - 300) * 1000)

module.exports = getAccessToken
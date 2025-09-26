const { createHmac } = require('node:crypto');

const secret = Buffer.from('senha de criptografia HMAC').toString('hex')
const oneHourInMilliseconds = 60 * 60 * 1000;

const generateJWTTokenForUser = (userId) => {

    return new Promise((res, rej) => {

        try {
            const now = Date.now()

            const header = { alg: "HS256", typ: "JWT" }
            const headerBase64 = Buffer.from(JSON.stringify(header)).toString('base64')

            const payload = { userId: userId, iat: now, iss: 'eseg', exp: now + oneHourInMilliseconds }
            const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64')

            const data = headerBase64 + '.' + payloadBase64

            const signature = createHmac('sha256', secret)
                .update(data)
                .digest('base64');

            const jwt = headerBase64 + '.' + payloadBase64 + '.' + signature

            res(jwt)
        }
        catch (err) { rej(err) }
    })

}

const validateJWTToken = (token) => {
    return new Promise((res, rej) => {
        try {
            const [encHeader, encPayload, candidateSignature] = token.split('.')

            //const decodedHeader = JSON.parse(Buffer.from(encHeader, 'base64').toString())
            //Devia validar isso também, mas para fins educacionais está ok

            const decodedPayload = JSON.parse(Buffer.from(encPayload, 'base64').toString())

            const computedSignature = createHmac('sha256', secret)
                .update(encHeader + '.' + encPayload)
                .digest('base64');

            const valid = computedSignature === candidateSignature

            const result = { valid, payload: valid ? decodedPayload : undefined }

            res(result)
        }
        catch (err) { rej(err) }
    })
}

module.exports = { generateJWTTokenForUser, validateJWTToken }
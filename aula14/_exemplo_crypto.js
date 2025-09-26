const { createHmac } = require('node:crypto');

// const secret = 'abcdefg';
// const hash = createHmac('sha256', secret)
//                .update('Isso é um teste')
//                .digest('base64');
// console.log({hash});

// const base64 = Buffer.from('Isso é um teste').toString('base64')
// console.log({base64})

// const plain = Buffer.from(base64, 'base64').toString()
// console.log({plain})


const secret = Buffer.from('minha senha').toString('hex')

const header = { alg: "HS256", typ: "JWT" }
const headerBase64 = Buffer.from(JSON.stringify(header)).toString('base64')

const payload = {userId : 1, iat: Date.now(), iss:'eseg'}
const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64')

const data = headerBase64 + '.' + payloadBase64

const signature = createHmac('sha256', secret)
.update(data)
.digest('base64');

const jwt = headerBase64 + '.' + payloadBase64 + '.' + signature

console.log({
    secret,
    header,
    headerBase64,
    payload,
    payloadBase64,
    signature,
    jwt
})


const [encHeader, encPayload, candidateSignature] = jwt.split('.')

const decodedHeader = JSON.parse(Buffer.from(encHeader, 'base64').toString())

const decodedPayload = JSON.parse(Buffer.from(encPayload, 'base64').toString())


const computedSignature = createHmac('sha256', secret)
.update(encHeader + '.' + encPayload)
.digest('base64');

console.log({
    encHeader, 
    encPayload, 
    candidateSignature, 
    decodedHeader, 
    decodedPayload, 
    computedSignature,
    match : computedSignature === candidateSignature
})

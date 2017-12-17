const { signedRequest } = require('./rest/request')
const { analyseMarkets } = require('./analyse/markets')

const API_KEY = process.env.API_KEY
const API_SECRET = process.env.API_SECRET
const AUTO_BUY = false
const AUTO_SELL = false

if (!API_KEY) {
    throw new Error('API_KEY not provided!')
}

if (!API_SECRET) {
    throw new Error('API_SECRET not provided!')
}

// signedRequest('https://bittrex.com/api/v1.1/account/getorderhistory', API_KEY, API_SECRET)
//     .then(r => console.log(r))

function logger(input) {
    console.log(new Date().toString() + ' :::: ' + input + ' ::::')
}

async function runBot() {
    const analysisResult = await analyseMarkets()
    logger(analysisResult)

    setTimeout(() => {
        runBot()
    }, 10000)
}

logger('___START BITTREX TRADER BOT___')
runBot()
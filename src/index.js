// dependencies
const fs = require('fs')
const { signedRequest } = require('./rest/request')
const { analyseMarkets } = require('./analyse/markets')
const { logger } = require('./utils/logger')

// constants
const API_KEY = process.env.API_KEY
const API_SECRET = process.env.API_SECRET
const AUTO_BUY = false
const AUTO_SELL = false

const ANALYSIS_INTERVAL = 30000

// check process
if (!API_KEY) {
    throw new Error('API_KEY not provided!')
}

if (!API_SECRET) {
    throw new Error('API_SECRET not provided!')
}

// signedRequest('https://bittrex.com/api/v1.1/account/getorderhistory', API_KEY, API_SECRET)
//     .then(r => console.log(r))

// start analysis every `ANALYSIS_INTERVAL` seconds
async function runBot() {
    const marketState = await analyseMarkets({
        apiKey: API_KEY,
        apiSecret: API_SECRET,
        autoBuy: AUTO_BUY,
        autoSell: AUTO_SELL
    })

    const fs = require('fs');
    
    let student = {  
        name: 'Mike',
        age: 23, 
        gender: 'Male',
        department: 'English',
        car: 'Honda' 
    };
    
    // save status to file
    let data = JSON.stringify(marketState)
    fs.writeFile('public/marketState.json', data, 'utf8', () => {})
    
    // logger(JSON.stringify(traderState))

    setTimeout(() => {
        runBot()
    }, ANALYSIS_INTERVAL)
}

// lets go!
logger('___START BITTREX TRADER BOT___')
runBot()
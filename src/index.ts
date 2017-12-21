// dependencies
import { writeFile } from 'fs'
import { signedRequest } from './rest/request'
import { analyseMarkets } from './analyse/markets'
import { logger } from './utils/logger'

declare const process: any

// constants
const API_KEY = process.env.API_KEY
const API_SECRET = process.env.API_SECRET
const AUTO_BUY = false
const AUTO_SELL = false

const ANALYSIS_INTERVAL = 10000

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

    // save status to file
    const data = JSON.stringify(marketState)
    const htmlFile = `
        <html>
            <head>
                <script>const dataJson = '${data}';</script>
                <script src="browser.js" type="text/javascript"></script>
            </head>
            <body>
                Hello world
            </body>
        </html>
    `

    writeFile('public/marketState.html', htmlFile, 'utf8', () => {})

    setTimeout(() => {
        runBot()
    }, ANALYSIS_INTERVAL)
}

// lets go!
logger('___START BITTREX TRADER BOT___')
runBot()

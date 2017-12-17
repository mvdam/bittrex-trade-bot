const CryptoJS = require('crypto-js')

function createHeaders(uri, apiSecret) {
    const hash = CryptoJS.HmacSHA512(uri, apiSecret).toString()

    return {
        'apisign': hash,
        'User-Agent': 'Mozilla/4.0 (compatible; Node Bittrex API)',
        'Content-type': 'application/x-www-form-urlencoded'
    }
}

function getNonce() {
    return new Date().getTime()
}

module.exports = {
    createHeaders,
    getNonce
}
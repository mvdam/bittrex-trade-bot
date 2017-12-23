import CryptoJS from 'crypto-js'

export function createHeaders(uri, apiSecret) {
    const hash = CryptoJS.HmacSHA512(uri, apiSecret).toString()

    return {
        'apisign': hash,
        'User-Agent': 'Mozilla/4.0 (compatible; Node Bittrex API)',
        'Content-type': 'application/x-www-form-urlencoded'
    }
}

export function getNonce() {
    return new Date().getTime()
}

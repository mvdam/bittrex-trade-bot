const CryptoJS = require('crypto-js')
const fetch = require('node-fetch')

const API_KEY = process.env.API_KEY
const API_SECRET = process.env.API_SECRET

if (!API_KEY) {
    throw new Error('API_KEY not provided!')
}

if (!API_SECRET) {
    throw new Error('API_SECRET not provided!')
}

console.log('OK!')

// signedRequest('/account/getorderhistory', API_KEY, API_SECRET).then(r => console.log(r))



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
  
  function signedRequest(action, apiKey, apiSecret) {
    const baseUrl = `https://bittrex.com/api/v1.1`
    const nonce = getNonce()
    const url = `${baseUrl}${action}?apikey=${apiKey}&nonce=${nonce}`
    const headers = createHeaders(url, apiSecret)
  
    return fetch(url, { method: 'GET', headers })
      .then(res => res.json())
      .then(json => json.result)
  }
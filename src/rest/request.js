const fetch = require('node-fetch')
const { createHeaders, getNonce } = require('./utils')

function signedRequest(action, apiKey, apiSecret) {
    const nonce = getNonce()
    const url = `${action}?apikey=${apiKey}&nonce=${nonce}`
    const headers = createHeaders(url, apiSecret)

    return fetch(url, { method: 'GET', headers })
        .then(res => res.json())
        .then(json => json.result)
}

function request(url) {
    return fetch(url)
        .then(res => res.json())
}

module.exports = {
    signedRequest,
    request
}
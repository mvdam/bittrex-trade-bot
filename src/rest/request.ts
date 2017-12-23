import fetch from 'node-fetch'
import { createHeaders, getNonce } from '../utils/rest'

export function signedRequest(action: string, apiKey: string, apiSecret: string) {
    const nonce = getNonce()
    const url = `${action}?apikey=${apiKey}&nonce=${nonce}`
    const headers = createHeaders(url, apiSecret)

    return fetch(url, { method: 'GET', headers })
        .then(res => res.json())
        .then(json => json.result)
}

export function request(url: string) {
    return fetch(url)
        .then(res => res.json())
}

import * as CryptoJS from 'crypto-js'

export function createHeaders(uri: string, apiSecret: string) {
  const hash = CryptoJS.HmacSHA512(uri, apiSecret).toString()

  return {
    apisign: hash,
    'User-Agent': 'Mozilla/4.0 (compatible; Node Bittrex API)',
    'Content-type': 'application/x-www-form-urlencoded'
  }
}

export function getNonce(): number {
  return new Date().getTime()
}

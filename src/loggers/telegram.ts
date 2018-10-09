import fetch from 'node-fetch'

export const telegramLogger = (API_KEY: string, CHAT_ID: string) => (text: string) => {
  const params = `bot${API_KEY}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(text)}`
  const url = `https://api.telegram.org/${params}`

  return fetch(url)
}

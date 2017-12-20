function init() {
  const dataSet = JSON.parse(dataJson)

  const markets = Object.keys(dataSet)
  let openOrders = []

  markets.forEach(m => {
    const data = dataSet[m]

    if (data.trade.placed) {
      openOrders.push(m)
    }
  })

  document.write('Open orders (' + openOrders.length + '):<br>' + openOrders.join('<br>') + '<br><br>Last updated ' + new Date().toString() + '<br><br>')

  setTimeout(() => {
    'use strict'
    window.location.reload()
  }, 10000)
}







init()

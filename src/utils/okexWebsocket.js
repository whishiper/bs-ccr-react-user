
class OkexWebsocket {
  static init({ url = 'ws://47.75.221.183:8080/', symbols, getOpenPrice }) {
    OkexWebsocket.ws = new WebSocket(url);
    OkexWebsocket.symbols = symbols
    OkexWebsocket.getOpenPrice = getOpenPrice
    OkexWebsocket.onOpen()
    OkexWebsocket.onmessage()
  }

  static onOpen() {
    const { ws, symbols } = this;
    ws.onopen = function () {
      console.log("onopen", 'symbols', symbols);
      ws.send(JSON.stringify(symbols))
    };
    ws.onclose = this.close
  }

  static onmessage() {
    const { ws } = this;
    ws.onmessage = (event) => {
      const { data } = event;
      try {
        this.handleReponseData(JSON.parse(data));
      } catch (error) {
        console.log(error, 'onmessage------eror')
      }

    };
  }

  static handleData(msg) {
    var data = JSON.parse(msg);
    if (data.ping) {
      this.sendHeartMessage(data.ping);
      return;
    }

    this.handleReponseData(data);
  }

  static sendHeartMessage(ping) {
    const { ws } = this
    if (ws.readyState === 1) {
      ws.send(JSON.stringify({ pong: ping }));
    }
  }

  static handleReponseData(value) {
    if (Reflect.has(value, "table")&& value.table ==='spot/ticker') {
      const { getOpenPrice } = this
      const { data } = value;
      const { instrument_id, best_bid, best_ask } = data[0]
      getOpenPrice({ symbol: instrument_id, openPrice: best_bid, buyPrice: best_bid, sellPrice: best_ask })
    }
  }

  static close() {
    const { ws, symbols } = this
    console.log('close------', ws)
    if (ws) {

      if (Array.isArray(symbols) && symbols.length > 0) {
        var args = symbols.map(symbol => `spot/ticker:${symbol}`);
        var unsubscribe = {
          op: "unsubscribe",
          args
        };
        console.log(ws.readyState, '----ws.readyState')
        if (ws.readyState === 1) {
          ws.send(JSON.stringify(unsubscribe));
        }
      }
      ws.onclose()
    }
  }

}

export default OkexWebsocket
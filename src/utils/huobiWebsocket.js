class HouBiWebsocket {
  static init({ url = 'ws://47.52.237.21:8080/', symbols, getOpenPrice }) {
    HouBiWebsocket.ws = new WebSocket(url);
    HouBiWebsocket.symbols = symbols
    HouBiWebsocket.getOpenPrice = getOpenPrice
    HouBiWebsocket.onOpen()
    HouBiWebsocket.onmessage()
  }

  static onOpen() {
    const { ws, symbols } = this;
    ws.onopen = () => {
      console.log(symbols,'---------symbols')
      ws.send(JSON.stringify(symbols));
    }
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

  static handleReponseData(data) {
    if (Reflect.has(data, "ch")) {
      const { symbols, getOpenPrice } = this
      const { ch, tick: { bids, asks } } = data;
      const i = symbols.find(item => ch.includes(item))
      getOpenPrice({ symbol: i, openPrice: bids[0][0], buyPrice: bids[0][0], sellPrice: asks[0][0] })
    }
  }

  static close() {
    const { ws, symbols } = this
    if (ws) {

      if (Array.isArray(symbols) && symbols.length > 0) {
        symbols.forEach(symbol => {
          let unsubscribe = { unsub: `market.${symbol}.depth.step0`, id: symbol };
          if (ws.readyState === 1) {
            ws.send(JSON.stringify(unsubscribe));
          }

        });
      }

      ws.onclose()
    }
  }

}

export default HouBiWebsocket
import {
  searchCoinPairs,
  isAddChoice,
  addAoinPairChoice,
  getCoinPairsChoiceList,
  huobiMarketTickers
} from 'services/app';

import HouBiWebsocket from 'utils/huobiWebsocket';
import OkexWebsocket from 'utils/okexWebsocket';
import { message } from 'antd';
import { handlerResults, updateState } from 'utils/handlerResults'

export default {
  namespace: 'addCoinPairs',
  state: {
    coinType: '', // 0未知 | 1 主流 | 2 官方 | 3 主流和官方
    searchValue: '',
    loading: false,
    pageSize: 10,
    page: 1,
    total: 10,
    quotCurrencyName: '',
    quotCurrencyId: '',
    robotBindApiId: '',
    tableData: [],
    webSocketName: null,
    closeWebsocket: null,
    startWebsocket: null
  },
  effects: {

    *start({ payload }, { put }) {
      const {
        startWebsocket,
        closeWebsocket,
        coinId,
        coinName,
        robotBindApiId
      } = payload

      const tradePatformApi = JSON.parse(sessionStorage.getItem('tradePatformApi')) || {};

      const { tradePlatform } = tradePatformApi
      const { name } = tradePlatform
      let webSocketName = ''

      if (!name) {
        return
      }

      if (name === 'huobi') {
        webSocketName = HouBiWebsocket
      } else if (name === 'okex') {
        webSocketName = OkexWebsocket
      }

      yield updateState({
        quotCurrencyName: coinName,
        quotCurrencyId: coinId,
        robotBindApiId,
        coinType: '',
        tableData: [],
        page: 1,
        total: 10,
        startWebsocket,
        closeWebsocket,
        webSocketName,
        tradePatformApi
      }, put)

    },

    // 搜索自选货币对
    *searchCoinPairs(_, { put }) {
      yield put({ type: 'getSearchCoinPairs' })
    },

    // 获取自选货币对
    *getSearchCoinPairs(_, { put, call, select }) {

      yield updateState({ loading: true, }, put)

      const { addCoinPairs } = yield (select(_ => _))
      const { searchValue,
        quotCurrencyName,
        quotCurrencyId,
        coinType,
        startWebsocket,
        closeWebsocket,
        webSocketName,
        tradePatformApi,
        robotBindApiId
      } = addCoinPairs

      const { tradePlatform } = tradePatformApi
      const params = { type: coinType }

      if (tradePlatform.name === 'okex') {
        Object.assign(params, {
          base_currency_name: searchValue ? searchValue.toUpperCase() : '',
          quot_currency_name: quotCurrencyName.toUpperCase(),
        })
      } else if (tradePlatform.name === 'huobi') {
        Object.assign(params, {
          base_currency_name: searchValue ? searchValue.toLocaleLowerCase() : '',
          quot_currency_name: quotCurrencyName.toLocaleLowerCase(),
        })
      }

      let data = yield call(searchCoinPairs, params);

      const is_true = !(typeof data === 'object'
        && Reflect.has(data, 'data')
        && Array.isArray(data.data))

      if (is_true) {
        yield updateState({
          loading: false,
          searchValue: '',
          tableData: [],
          coinType: ''
        }, put)
        return
      }


      // 获取添加自选货币对
      const coinparams = {
        coinId: quotCurrencyId,
        tradePlatformApiBindProductComboId: Number(robotBindApiId),
      }
      const coin = yield call(getCoinPairsChoiceList, coinparams)

      const is_coin_true = coin
        && typeof coin === 'object'
        && Reflect.has(coin, 'list')

      const new_coin_list = is_coin_true ? coin.list.map(item => item.coinPair.name) : []

      let new_list = data.data.map(item => {
        let score;
        if (item.score === 1) {
          score = '主流货币对'
        } else if (item.score === 2) {
          score = '官方货币对'
        } else if (item.score === 3) {
          score = '官方、主流货币对'
        }

        const newItem = {
          tradingStatus: true,
          currencyPair: item.symbol,
          symbol: item.symbol,
          partition: score,
          is_choice: false,
          isStart: 1,
          trade_status: 0,
          key: Math.random() * 1000
        };

        let symbol = item.symbol
        if (tradePlatform.name === 'okex') {
          symbol = item.symbol.replace(/-/g, '').toLocaleLowerCase()
        }

        for (let i of new_coin_list) {
          if (symbol === i) {
            Object.assign(newItem, { is_choice: true })
          }
        }

        return newItem
      })

      yield updateState({
        tableData: new_list,
        total: new_list.length,
        loading: false,
        searchValue: '',
        coinType: ''
      }, put)

      // 获取货币自选货币对最新报价
      let huobi_data = []
      if (tradePlatform.name === 'huobi') {
        huobi_data = yield call(huobiMarketTickers)
        console.log(huobi_data, '------huobi_data')

        const is_huobi_true = huobi_data
          && typeof huobi_data === 'object'
          && Reflect.has(huobi_data, 'data')
          && Array.isArray(huobi_data.data)

        if (is_huobi_true) {
          huobi_data = huobi_data.data

          yield updateState({
            tableData: new_list.map(item => {

              const isHasItem = huobi_data.find(i => i.symbol === item.symbol);
              console.log(isHasItem, '----isHasItem')
              if (isHasItem) {
                Object.assign(item, { openPrice: isHasItem.close })
              }
              return item
            }),
          }, put)
        }
      }


      // 开起websocket
      let symbols = []
      if (data.data
        && Array.isArray(data.data)
        && data.data.length > 0) {
        for (let item of data.data) {
          symbols.push(item.symbol)
        };
      }

      yield closeWebsocket({ webSocketName })
      yield startWebsocket({ symbols, webSocketName })
    },

    // 快速官方搜索
    *onSearchOfficial(_, { put }) {

      yield updateState({ coinType: 2, searchValue: '', tableData: [], }, put)
      yield put({ type: 'getSearchCoinPairs' })
    },

    // 快速主流搜索
    *onSearchPopular(_, { put }) {

      yield updateState({ coinType: 1, searchValue: '', tableData: [] }, put)
      yield put({ type: 'getSearchCoinPairs' })
    },


    *oPaginationChange({ payload }, { put }) {

      yield updateState({ page: payload }, put)
    },

    *addAoinPairChoice({ payload }, { put, call, select }) {

      const { value } = payload;
      const { currencyPair } = value
      const { addCoinPairs } = yield (select(_ => _));

      let coinPairName = currencyPair
      const { quotCurrencyId, quotCurrencyName, tradePatformApi } = addCoinPairs
      const { secret, sign, userId, tradePlatform } = tradePatformApi;

      if (tradePlatform.name === 'okex') {
        coinPairName = currencyPair.replace(/-/g, "").toLowerCase()
      }

      // 查询自选货币对信息
      const symbol = yield call(isAddChoice, { coinPairName });

      const is_true = !(typeof (symbol) === 'object'
        && Reflect.has(symbol, 'data')
        && typeof (symbol.data) === 'object'
        && symbol.data !== null
        && Reflect.has(symbol.data, 'id'))

      if (is_true) {
        message.info('已添加过自选')
        return
      }

      console.log(sign, '---sign')
      const params = {
        symbol: value.currencyPair.toLowerCase(),
        symbol_id: String(symbol.data.id),
        account_id: sign,
        userId: String(userId),
        secret,
        signId: sign,
        quote_currency_id: String(quotCurrencyId),
        quote_currency: quotCurrencyName
      }

      const data = yield call(addAoinPairChoice, params)
      handlerResults(data, '添加货币对成功！', '添加货币对失败！')

      const tableData = addCoinPairs.tableData.map(item => {
        item.is_choice = item.key === value.key ? true : item.is_choice;

        return item
      })

      yield updateState({ tableData }, put)
    },

  },
  reducers: {

    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

  },


}
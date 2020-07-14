import {
  getStrategyList,
  oneClickSetBudget,
  getStrategyExplain,
  triggerCurrencyKline,
  getTradePatformApi,
  huobiMarketDetailMerged,
  coinPairsChoiceByIsStartList,
} from 'services/app';
import { message } from 'antd';
import { updateState } from 'utils/handlerResults'
import { routerRedux } from 'dva/router';
import HouBiWebsocket from 'utils/huobiWebsocket';
import OkexWebsocket from 'utils/okexWebsocket';

export default {
  namespace: 'setBudget',
  state: {
    coinLoading: false,
    freeCoinPairList: [],
    tradePatformApi: {},
    coin: {},
    strategyList: [],
    strategyExplainArray: [],
    strategyExplain: {},
    allChecked: false,
    totalNumber: 0,
    totalMoney: 0,
    urlParams: {},
    loading: false,
    webSocketName: null,
    closeWebsocket: null,
    startWebsocket: null
  },
  effects: {

    *start({ payload }, { put, call }) {
      const {
        startWebsocket,
        closeWebsocket,
        coinName,
        coinId,
        tradePatformApiId,
        robotBindApiId } = payload

      // 获取 绑定平台信息
      yield put({
        type: 'getTradePatformApi', payload: {
          tradePatformApiId,
          coinId,
          robotBindApiId
        }
      })

      yield updateState({
        strategyExplain: {},
        allChecked: false,
        totalNumber: 0,
        totalMoney: 0,
        startWebsocket, closeWebsocket,
        urlParams: payload,
        coin: {
          id: coinId,
          name: coinName
        }
      }, put);

      yield call(triggerCurrencyKline, { currency: coinName });
    },

    // 交易平台信息
    *getTradePatformApi({ payload }, { put, call }) {
      const { tradePatformApiId, robotBindApiId, coinId } = payload;
      const data = yield call(getTradePatformApi, tradePatformApiId);

      const is_true = !(data
        && typeof data === 'object' && Reflect.has(data, 'id'))

      if (is_true) {
        return;
      }

      const { tradePlatform } = data
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
      yield updateState({ tradePatformApi: data, webSocketName }, put)

      // 获取 自选币对列表
      yield put({
        type: 'coinPairsChoiceByIsStartList', payload: {
          robotBindApiId,
          coinId
        }
      })
    },

    // 获取自选币列表
    *coinPairsChoiceByIsStartList({ payload }, { put, call, select }) {
      const { setBudget } = yield select(_ => _);
      const { tradePatformApi, closeWebsocket, startWebsocket, webSocketName, coin } = setBudget;
      const { tradePlatform } = tradePatformApi;
      const { robotBindApiId, coinId } = payload
      const { name } = tradePlatform
      const symbols = []

      const params = {
        coinId,
        tradePlatformApiBindProductComboId: Number(robotBindApiId),
        isStart: 1
      }

      yield updateState({ coinLoading: true }, put)
      const data = yield call(coinPairsChoiceByIsStartList, params)

      console.log(data, '-----coinPairsChoiceByIsStartList')

      const is_true = data
        && typeof data === 'object'
        && Array.isArray(data)
        && data.length !== 0

      let new_list = data.filter(item => Number(item.orderStatus) !== 1)

      console.log(new_list, '----new_list')

      let list = []

      if (is_true) {
        list = new_list.map(item => {
          const { coinPairChoiceAttribute } = item
          Object.assign(item, {
            key: item.id,
            strategyList: [],
            item_checked: false,
            item_money: '',
            item_strategyId: '',
            item_lever: '',
            budget: '',
            policy_name: ''
          })

          if (coinPairChoiceAttribute) {
            const { expectMoney, strategy } = coinPairChoiceAttribute
            Object.assign(item, {
              policy_name: strategy.name,
              budget: expectMoney/10000/strategy.lever
            })
          }
          return item
        })

      }

      yield updateState({ freeCoinPairList: list, coinLoading: false }, put)

      const huobi_promise = []
      // 获取huobi最新报价
      if (name === 'huobi') {
        for (let item of list) {

          const is_true = typeof item === 'object'
            && Reflect.has(item, 'coinPair')
            && item.coinPair !== null
            && typeof item.coinPair === 'object'

          if (is_true) {
            const huobi_item_promise = new Promise(async resolve => {
              const huobi_data = await huobiMarketDetailMerged({ symbol: item.coinPair.name })

              const is_huobi_true = huobi_data
                && typeof huobi_data === 'object'
                && Reflect.has(huobi_data, 'tick')
                & Reflect.has(huobi_data.tick, 'bid')

              if (is_huobi_true) {

                const { tick } = huobi_data
                const { bid, ask } = tick
                let new_huobi_data = {
                  openPrice: bid[0],
                  buyPrice: bid[0],
                  sellPrice: ask[0]
                }
                Object.assign(item, new_huobi_data)
              }
              resolve(item)
            })
            huobi_promise.push(huobi_item_promise)
          }

        }
      }


      if (name === 'okex') {
        if (new_list
          && Array.isArray(new_list)
          && new_list.length > 0) {
          for (let item of new_list) {

            let index = item.coinPair.name.lastIndexOf(coin.name)
            let frist = item.coinPair.name.slice(0, index)
            let last = item.coinPair.name.slice(index)
            let symbol = frist.toUpperCase() + '-' + last.toUpperCase()
            symbols.push(symbol)
          };
        }
        yield closeWebsocket({ webSocketName })
        yield startWebsocket({ symbols, webSocketName })
      }

      if (name === 'huobi') {

        const new_list_data = yield Promise.all(huobi_promise);
        console.log(new_list_data,'-----new_list_data')
        yield updateState({ freeCoinPairList: new_list_data, coinLoading: false }, put)

        if (new_list
          && Array.isArray(new_list)
          && new_list.length > 0) {
          for (let item of new_list) {
            symbols.push(item.coinPair.name)
          };
        }

        yield closeWebsocket({ webSocketName })
        yield startWebsocket({ symbols, webSocketName })
      }

      yield put({ type: 'getStrategyList' })
    },


    // 获取策略列表
    *getStrategyList(_, { put, call, select }) {

      const { setBudget } = yield select(_ => _)
      const { freeCoinPairList } = setBudget

      const data = yield call(getStrategyList)

      const is_true = !(data
        && typeof data === 'object'
        && Reflect.has(data, 'list'))
        && Array.isArray(data.list)

      if (is_true) {
        return
      }

      const strategyList = data.list

      yield updateState({
        strategyList,
        freeCoinPairList: freeCoinPairList.map(item => Object.assign(item, {
          strategyList,
        }))
      }, put)

      if (Reflect.has(data.list[0], 'id')) {
        yield put({
          type: 'getStrategyExplain', payload: data.list[0].id
        })
      }

      const array_promise = []
      for (let item of data.list) {
        const item_promise = new Promise(async (resolve, reject) => {
          const res = await getStrategyExplain(item.id)
          if (res.id) {
            resolve(res)
          }
        })

        array_promise.push(item_promise)
      }

      const new_data = yield Promise.all(array_promise);
      yield updateState({ strategyExplainArray: new_data || [] }, put)
    },

    // 策略说明
    *getStrategyExplain({ payload }, { put, call }) {

      const data = yield call(getStrategyExplain, payload)

      const is_true = !(typeof data === 'object' && Reflect.has(data, 'id'))
      if (is_true) {
        return
      }

      yield updateState({ strategyExplain: data }, put)
    },

    *handleFormCancel({ payload }, { put }) {

      const { form, history } = payload;
      yield history.goBack()
      yield form.resetFields()
    },

    // 设置应用
    *handleFormOk({ payload }, { call, put, select }) {

      const { setBudget } = yield select(_ => _);
      const { freeCoinPairList, tradePatformApi, urlParams } = setBudget;
      const { secret, sign, userId } = tradePatformApi;
      const { form } = payload;

      const symbol_list = [];

      yield updateState({ loading: true }, put)

      for (const item of freeCoinPairList) {

        if (item.item_checked) {
          symbol_list.push({
            buyPrice: item.buyPrice || 0,
            sellPrice: item.sellPrice || 0,
            id: item.coinPartnerId,
            symbol: item.coinPair.name.toLowerCase(),
            coinPairChoiceId: item.id,
            policy_id: item.item_strategyId,
            budget: item.item_money,
          });
        }
      }

      const params = {
        symbol_list: JSON.stringify(symbol_list),
        userId: Number(userId),
        signId: sign,
        secret
      };

      const data = yield call(oneClickSetBudget, params)

      const is_true = !(data && typeof Array.isArray(data))

      if (is_true) {
        return
      }

      let errors = []
      for (let item of data) {

        const is_true = !(item
          && typeof item === "object"
          && Reflect.has(item, "msg")
          && Reflect.get(item, "msg") === "success"
          && Reflect.has(item, "data")
          && Reflect.get(item, "data") === 1
        )

        if (is_true) {
          errors.push(item.errors || '')
        }
      }

      if (errors.length !== 0) {
        message.error(errors);
        yield updateState({ loading: false }, put)
        return
      }

      message.success('添加预算成功！');
      yield updateState({ loading: false }, put)
      yield form.resetFields()
      const { robotId, robotBindApiId, tradePlatformId, tradePatformApiId } = urlParams
      yield put(routerRedux.push(`/ccr/deal/${robotId}/${robotBindApiId}/${tradePlatformId}/${tradePatformApiId}/coin_pair_choice_list`))
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
import {
  coinSort,
  getCoinPairsChoiceList,
  getCoinPairsChoiceDetail,
  getTradePatformApi,
  deletelFreeCoinPair,
  getFreeCoinPairParams,
  setTradeParams,
  startTrade,
  pauseTrade,
  recoverBuy,
  getCurrencyInfo,
  getSymbol_info,
  stopProfitTrade,
  cancelStopProfitTrade,
  forgetOrders,
  sellAllOrders,
  getMqttConf
} from 'services/app';

import { handlerResults, updateState, getSymbolsRedis, getsymbolsPrice } from 'utils/handlerResults'
import { coin_base_four_num } from 'utils';
import HouBiWebsocket from 'utils/huobiWebsocket';
import OkexWebsocket from 'utils/okexWebsocket';

export default {
  namespace: 'dealAdmin',
  state: {
    loading: false,
    tradeLoading: false,
    coinLoading: false,
    dealFormModalVisible: false,
    BatchHandleModalVisible: false,
    setBudgetModalVisible: false,
    page: 1,
    pageSize: 10,
    total: 0,
    activeTabsKey: '',
    activeItem: {},
    tradePatformApi: {},
    coinSortList: [],
    coinSortPage: 1,
    coinSortPageSize: 10,
    coinSortTotal: 0,
    freeCoinPairList: [],
    dealParamsForm: {},
    currencyInfo: {},
    currencyLoading: false,
    isShowCurrencyInfo: true,
    activeFreeCoinPair: {},
    robotBindApiId: '',
    mqttOptions: {
      port: 80, //WebSocket 协议服务端口，如果是走 HTTPS，设置443端口
      useTLS: false, //是否走加密 HTTPS，如果走 HTTPS，设置为 true
      cleansession: false,
    },
    webSocketName: null,
    closeWebsocket: null,
    startWebsocket: null,
    signal: null
  },
  effects: {

    // 开始获取数据
    *start({ payload }, { put, call, select }) {
      const { dealAdmin } = yield select(_ => _);
      const { mqttOptions } = dealAdmin
      const { startWebsocket, closeWebsocket, robotBindApiId, tradePatformApiId, signal } = payload

      yield put({ type: 'getTradePatformApi', payload: { tradePatformApiId } })
      yield updateState({
        robotBindApiId,
        currencyInfo: {},
        freeCoinPairList: [],
        coinSortList: [],
        tradePatformApi: {},
        closeWebsocket,
        startWebsocket,
        signal
      }, put)

      yield sessionStorage.removeItem('tradePatformApi')
      yield sessionStorage.removeItem('freeCoinPairList')

      const mqtt = yield call(getMqttConf)
      const is_true = mqtt && typeof mqtt === 'object' && Reflect.has(mqtt, 'host')
      if (is_true) {
        yield updateState({
          mqttOptions: Object.assign(mqttOptions, mqtt)
        }, put)
      }
    },

    // 交易平台信息
    *getTradePatformApi({ payload }, { put, call }) {
      const { tradePatformApiId } = payload;

      yield updateState({ tradeLoading: true }, put)
      const data = yield call(getTradePatformApi, tradePatformApiId);

      const is_true = !(typeof data === 'object' && Reflect.has(data, 'id'))

      yield updateState({ tradeLoading: false }, put)

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
      const { tradePlatformId } = data
      sessionStorage.setItem('tradePatformApi', JSON.stringify(data))
      yield put({ type: 'getCoinSort', payload: { tradePlatformId, type: 1 } })
    },

    // 计价货币排序列表
    *getCoinSort({ payload }, { put, call }) {

      const data = yield call(coinSort, payload);

      const is_true = !(data
        && typeof data === 'object'
        && Reflect.has(data, 'list')
        && JSON.stringify(data.list) !== '[]')

      if (is_true) {
        return
      }

      yield updateState({ coinSortList: data.list }, put)
      yield put({ type: 'onTabChange', payload: data.list[0].coin.id })
    },

    // 获取自选币列表
    *getCoinPairsChoiceList(_, { put, call, select }) {
      const { dealAdmin } = yield select(_ => _);
      const {
        activeTabsKey,
        robotBindApiId,
        tradePatformApi,
        closeWebsocket,
        startWebsocket,
        webSocketName,
        signal,
      } = dealAdmin;
      const { sign, tradePlatform } = tradePatformApi;
      const { name } = tradePlatform
      const symbols = []

      const params = {
        coinId: activeTabsKey,
        tradePlatformApiBindProductComboId: Number(robotBindApiId),
        signal
      }

      yield updateState({ coinLoading: true }, put)
      const data = yield call(getCoinPairsChoiceList, params)

      yield updateState({ coinLoading: false }, put)
      const is_true = !(data
        && typeof data === 'object'
        && Reflect.has(data, 'list')
        && Array.isArray(data.list)
        && data.list.length !== 0)

      if (is_true) {
        yield updateState({ freeCoinPairList: [], coinLoading: false }, put)
        return
      }

      const list = data.list.map(item => Object.assign(item, {
        key: item.id,
        loading: true
      }))

      yield updateState({ freeCoinPairList: list, coinLoading: false }, put)
      const state= yield select(_ => _);

      console.log(state.dealAdmin.freeCoinPairList,'----freeCoinPairList')

      // 获取huobi最新报价
      let new_list_array = list

      if (name === 'huobi') {
        const list_symbol_price = yield getsymbolsPrice(list, sign, signal)

        new_list_array = list.map(item => {

          for (let i of list_symbol_price) {
            if (item.coinPair.name === i.new_item_symbol) {
              Object.assign(item, i)
            }
          }
          return item
        })
        sessionStorage.setItem('freeCoinPairList', JSON.stringify(new_list_array))
        yield updateState({ freeCoinPairList: new_list_array }, put)
      }

      if (name === 'huobi') {
        if (list
          && Array.isArray(list)
          && list.length > 0) {
          for (let item of list) {
            symbols.push(item.coinPair.name)
          };
        }

        yield closeWebsocket({ webSocketName })
        yield startWebsocket({ symbols, webSocketName })
      }


      yield updateState({
        freeCoinPairList: new_list_array.map(item => Object.assign(item, {
          key: item.id,
          loading: true
        }))
      }, put)

      const list_symbol_redis = yield getSymbolsRedis(new_list_array, sign, signal)

      console.log(list_symbol_redis, '-----list_symbol_redis')

      let redis_list = list.map(item => {

        for (let i of list_symbol_redis) {
          if (item.coinPair.name === i.new_item_symbol) {
            Object.assign(item, i)
          }
        }
        return item
      })

      sessionStorage.setItem('freeCoinPairList', JSON.stringify(redis_list))
      yield updateState({ freeCoinPairList: redis_list }, put)

      if (name === 'okex') {
        if (list_symbol_redis
          && Array.isArray(list_symbol_redis)
          && list_symbol_redis.length > 0) {
          for (let item of list_symbol_redis) {
            symbols.push(item.symbol)
          };
        }
        yield closeWebsocket({ webSocketName })
        yield startWebsocket({ symbols, webSocketName })
      }

    },

    // 获取计价货币交易(总持仓费用，总预算，交易货币对数量,资产等）
    *getCurrencyInfo(_, { put, call, select }) {

      const { dealAdmin } = yield select(_ => _);
      const {
        coinSortList,
        activeTabsKey,
        tradePatformApi,
        robotBindApiId
      } = dealAdmin;
      const { userId, secret, sign } = tradePatformApi;

      const coinItem = coinSortList.find(item => Number(activeTabsKey) === Number(item.coin.id))
      const params = {
        currency: coinItem.coin.name.toLowerCase(),
        currency_id: activeTabsKey,
        userId,
        account_id: sign,
        secret,
        tradePlatformApiBindProductComboId: Number(robotBindApiId),
        signId: sign,
      }

      yield updateState({ currencyLoading: true }, put)
      const data = yield call(getCurrencyInfo, params);

      let currencyInfo = {
        budget_total: '',
        position_cost_total: '',
        trading_symbol_num: '',
        balance: {}
      }

      const is_true = !(data
        && typeof data === 'object'
        && Reflect.has(data, 'budget_total')
        && Reflect.has(data, 'balance')
        && Reflect.has(data.balance, 'balance')
      )

      if (is_true) {
        yield updateState({
          currencyInfo,
          currencyLoading: false,
          isShowCurrencyInfo: false
        }, put)
        return
      }

      const {
        budget_total = '',
        position_cost_total = '',
        trading_symbol_num = '',
        balance = {}
      } = data

      currencyInfo = {
        budget_total,
        position_cost_total,
        trading_symbol_num,
        balance
      }

      yield updateState({
        currencyInfo,
        currencyLoading: false,
        isShowCurrencyInfo: true
      }, put)
    },

    *onTabChange({ payload }, { put, select }) {

      const { dealAdmin } = yield select(_ => _);
      const { coinSortList } = dealAdmin;
      const activeItem = coinSortList.find(item => Number(item.coin.id) === Number(payload)) || {};

      sessionStorage.removeItem('freeCoinPairList');
      yield updateState({
        activeItem,
        freeCoinPairList: [],
        activeTabsKey: Number(payload),
        coinName: activeItem.coin.name,
        currencyInfo: {
          budget_total: '',
          position_cost_total: '',
          trading_symbol_num: '',
          balance: {}
        }
      }, put)

      yield put({ type: 'getCoinPairsChoiceList' })
      yield put({ type: 'getCurrencyInfo' });
    },

    /**
     * 
     *属性说明
     * stopProfitType  1 追踪 2 固定
     * stopProfitFixedRate 固定止盈比例
     * stopProfitMoney 止盈金额
     * stopProfitTraceDropRate 追踪止盈回降比例
     * stopProfitTraceTriggerRate 追踪止盈触发比例
     * real_time_earning_ratio 实时收益比
     */

    // 获取交易参数
    *setDealParamsModalShow({ payload }, { put, call }) {

      const data = yield call(getFreeCoinPairParams, payload.id);

      const is_true = !(data && typeof data === 'object' && Reflect.has(data, 'id'))

      if (is_true) {
        yield updateState({
          dealParamsForm: {},
          dealFormModalVisible: true,
          activeFreeCoinPair: payload
        }, put)
        return
      }

      const real_time_earning_ratio = coin_base_four_num(payload.real_time_earning_ratio, payload) || 0;

      const {
        stopProfitTraceTriggerRate = 0,
        stopProfitTraceDropRate = 0,
        stopProfitFixedRate = 0,
        stopProfitType = 1,
        stopProfitMoney = 0,
        coinPairChoiceId,
        id
      } = data;

      let dealParamsForm = {
        stopProfitType: stopProfitType,
        stopProfitMoney:stopProfitMoney,
        stopProfitTraceTriggerRate: Math.floor(stopProfitTraceTriggerRate * 10000)/100,
        stopProfitTraceDropRate:  Math.floor(stopProfitTraceDropRate * 10000)/100,
        stopProfitFixedRate:  Math.floor(stopProfitFixedRate * 10000)/100,
        name: payload.coinPair.name,
        real_time_earning_ratio,
        coinPairChoiceId,
        checkboxProfitMoney: stopProfitMoney !== 0,
        id
      }

      yield updateState({
        dealParamsForm,
        dealFormModalVisible: true,
        activeFreeCoinPair: payload
      }, put)
    },

    // 设置交易参数
    *setDealParamsModalOk({ payload }, { put, call, select }) {

      const { dealAdmin } = yield (select(_ => _));
      const { tradePatformApi, dealParamsForm } = dealAdmin;
      const { secret, sign } = tradePatformApi;
      const { name } = dealParamsForm

      const { values, form } = payload;

      const {
        stopProfitType,
        stopProfitTraceTriggerRate,
        stopProfitTraceDropRate,
        stopProfitFixedRate,
        stopProfitMoney,
        id,
        coinPairChoiceId,
      } = values

      console.log(Number(stopProfitTraceTriggerRate) / 100, ' Number(stopProfitTraceTriggerRate) / 100')
      console.log(values, '----values')

      const params = {
        secret,
        signId: sign,
        id,
        symbol: name,
        symbol_id: coinPairChoiceId,// 自选币 id
        emit_ratio: parseFloat(stopProfitTraceTriggerRate) / 100, //追踪止盈触发比例
        turn_down_ratio: parseFloat(stopProfitTraceDropRate) / 100, // 追踪止盈回降比例
        stopProfitFixedRate: parseFloat(stopProfitFixedRate) / 100, // 固定止盈比例
        is_use_follow_target_profit: stopProfitType, // '0' 是固定 '1'是 追踪
        target_profit_price: parseFloat(stopProfitMoney), // 止盈金额
      }

      const data = yield call(setTradeParams, params)
      handlerResults(data, '设置交易参数成功！', '设置交易参数失败！')


      yield updateState({
        dealParamsForm: {},
        dealFormModalVisible: false
      }, put)
      form.resetFields()
    },

    *setDealParamsModalCancel({ payload }, { put }) {
      const { form } = payload;
      yield updateState({
        dealParamsForm: {},
        dealFormModalVisible: false
      }, put)
      form.resetFields()
    },

    *handleBatchHandleModalShow(_, { put }) {

      yield updateState({ BatchHandleModalVisible: true }, put)
    },

    *handleBatchHandleModalCancel(_, { put }) {

      yield updateState({ BatchHandleModalVisible: false }, put)
    },

    *handleBatchHandleModalOk(_, { put }) {

      yield updateState({ BatchHandleModalVisible: false }, put)
    },

    // 操作处理公共方法
    *handelePublicMethode({ payload }, { put, call, select }) {
      const { dealAdmin } = yield (select(_ => _));
      const { tradePatformApi, freeCoinPairList, activeItem } = dealAdmin;
      const { secret, sign, userId } = tradePatformApi;
      const { item, method, success, error, getCurrencyInfo = false } = payload

      console.log(payload, '----payload')

      const params = {
        secret,
        signId: sign,
        userId,
        buyPrice: item.buyPrice || 0,
        sellPrice: item.sellPrice || 0,
        symbol: item.coinPair.name,
        coinPairChoiceId: item.id,
        symbol_id: item.symbol_id || '',
        quote_currency_id: String(activeItem.coin.id),
        quote_currency: activeItem.coin.name,
        finished_order: item.finished_order
      }

      const newList = freeCoinPairList.map(i => {
        if (Number(i.id) === Number(item.id)) {
          Object.assign(i, { loading: true })
        }
        return i
      })
      console.log(newList, '-----newList')

      yield updateState({ freeCoinPairList: newList }, put)

      let data = yield call(method, params)

      const is_true = handlerResults(data, success, error)

      console.log(data, '----handelePublicMethode', 'is_true', is_true)
      if (!is_true) {
        const list = freeCoinPairList.map(i => {
          return Number(i.id) === Number(item.id) ? Object.assign(i, { loading: false }) : i
        })
        yield updateState({ freeCoinPairList: list }, put)
        sessionStorage.setItem('freeCoinPairList', JSON.stringify(list))
        return
      }

      // 获取自选币详情
      const getDetail = new Promise(async resolve => {
        const detail_data = await getCoinPairsChoiceDetail(item.id)

        const is_true = detail_data && typeof detail_data === 'object' && Reflect.has(detail_data, 'id')
        resolve(is_true ? detail_data : {})
      })

      // 获取redis 货币信息
      const getInfo = new Promise(async resolve => {
        const info_data = await getSymbol_info({ symbol: item.coinPair.name, signId: sign })
        const is_true = info_data && typeof info_data === 'object' && Reflect.has(info_data, 'symbol')

        resolve(is_true ? info_data : {})
      })

      const new_data = yield Promise.all([getDetail, getInfo]);

      const [detail, info] = new_data

      const list = freeCoinPairList.map(i => {

        if (Number(i.id) === Number(item.id)) {
          Object.assign(i, detail, info, { loading: false })
        }
        return i
      })

      console.log(list, '-----list')
      yield updateState({ freeCoinPairList: list }, put)
      sessionStorage.setItem('freeCoinPairList', JSON.stringify(list))

      // 获取资产
      if (getCurrencyInfo) {
        yield put({ type: 'getCurrencyInfo' })
      }
    },

    // 删除自选货币对
    *deletelFreeCoinPair({ payload }, { put, select, call }) {

      const { dealAdmin } = yield (select(_ => _));
      const { tradePatformApi, freeCoinPairList } = dealAdmin;
      const { secret, sign, userId } = tradePatformApi;

      const params = {
        secret,
        signId: sign,
        userId,
        symbol: payload.coinPair.name,
        coinPairChoiceId: payload.id,
        symbol_id: payload.coinPartnerId || '',
      }

      let data = yield call(deletelFreeCoinPair, params)

      const is_true = handlerResults(data, '删除成功！', '')

      if (is_true) {
        const list = freeCoinPairList.filter(item => item.id !== payload.id)

        yield updateState({ freeCoinPairList: list }, put)
        sessionStorage.setItem('freeCoinPairList', JSON.stringify(list))
        yield put({ type: 'getCurrencyInfo' })
      }
    },

    // 开启策略
    *startTrade({ payload }, { put }) {

      let params = {
        item: payload,
        method: startTrade,
        success: '开启策略成功！',
        error: '',
      }

      yield put({ type: 'handelePublicMethode', payload: params })
    },

    // 暂停买入
    *pauseTrade({ payload }, { put }) {

      let params = {
        item: payload,
        method: pauseTrade,
        success: '暂停买入成功！',
        error: '',
      }

      yield put({ type: 'handelePublicMethode', payload: params })
    },

    // 恢复买入
    *recoverBuy({ payload }, { put }) {

      let params = {
        item: payload,
        method: recoverBuy,
        success: '恢复买入成功！',
        error: ''
      }

      yield put({ type: 'handelePublicMethode', payload: params })
    },

    // 止盈后停止
    *stopProfitTrade({ payload }, { put }) {

      let params = {
        item: payload,
        method: stopProfitTrade,
        success: '止盈后停止成功！',
        error: ''
      }

      yield put({ type: 'handelePublicMethode', payload: params })
    },

    // 取消止盈后停止
    *cancelStopProfitTrade({ payload }, { put }) {

      let params = {
        item: payload,
        method: cancelStopProfitTrade,
        success: '取消止盈后停止成功！',
        error: ''
      }

      yield put({ type: 'handelePublicMethode', payload: params })
    },

    // 立即停止 忘记订单
    *forgetOrders({ payload }, { put }) {

      let params = {
        item: payload,
        method: forgetOrders,
        success: '立即停止 忘记订单成功！！',
        error: '',
        getCurrencyInfo: true
      }

      yield put({ type: 'handelePublicMethode', payload: params })
    },

    // 立即停止 清仓卖出
    *sellAllOrders({ payload }, { put, call, select }) {

      let params = {
        item: payload,
        method: sellAllOrders,
        success: '立即停止 清仓卖出成功！',
        error: ''
      }

      yield put({ type: 'handelePublicMethode', payload: params })
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
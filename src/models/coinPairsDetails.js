
import {
  getCoinPairsChoiceDetail,
  getHoldSharesList,
  getSymbol_info,
  startTrade,
  pauseTrade,
  recoverBuy,
  deletelFreeCoinPair,
  stopProfitTrade,
  cancelStopProfitTrade,
  sellAllOrders,
  forgetOrders,
  getFreeCoinPairParams,
  setTradeParams,
  getTradePatformApi,
  huobiMarketDetailMerged
} from 'services/app';
import HouBiWebsocket from 'utils/huobiWebsocket';
import OkexWebsocket from 'utils/okexWebsocket';

import { handlerResults, updateState } from 'utils/handlerResults'
import { numberToChinese, coin_base_four_num } from 'utils'

export default {
  namespace: 'coinPairsDetails',
  state: {
    list: [],
    coinPairChoice: {},
    loading: false,
    signId: '',
    id: '',
    isOpenSetTradeParam: false,
    tradeParamForm: {},
    webSocketName: null,
    closeWebsocket: null,
    startWebsocket: null
  },
  effects: {

    *start({ payload }, { put }) {
      const { startWebsocket, closeWebsocket, } = payload

      yield updateState({
        startWebsocket,
        closeWebsocket
      }, put)

      yield put({
        type: 'getTradePatformApi', payload
      })
    },
    // 交易平台信息
    *getTradePatformApi({ payload }, { put, call }) {
      const { tradePatformApiId, signId, id } = payload;
      const data = yield call(getTradePatformApi, tradePatformApiId);

      console.log(data, '-----getTradePatformApi')

      const is_true = !(typeof data === 'object' && Reflect.has(data, 'id'))

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

      // 获取 自选币对信息
      yield put({
        type: 'getCoinPairsChoiceDetail', payload: {
          signId, id
        }
      })
    },

    *getList({ payload }, { put, call, select }) {
      const { coinPairChoiceId } = payload

      yield updateState({ loading: true }, put)

      const data = yield call(getHoldSharesList, { coinPairChoiceId })
      let is_true = !(data &&
        typeof data === 'object'
        && Reflect.has(data, 'data'))

      if (is_true) {
        yield updateState({ loading: false, list: [] }, put)
        return
      }

      let { tradeOrders = [], coinPairChoiceName = '' } = data.data

      if (!Array.isArray(tradeOrders)) {
        tradeOrders = []
      }
      // const is_new_true = tradeType === 2 || tradeType === 3 || tradeType === 4
      const size = tradeOrders.length
      yield updateState({
        list: tradeOrders.map((item, index) => Object.assign(item,
          { key: item.id, new_name: `第${numberToChinese(size - index)}单`, })),
        coinPairChoiceName,
        loading: false
      }, put)
    },

    *getCoinPairsChoiceDetail({ payload }, { call, put, select }) {
      const { coinPairsDetails } = yield select(_ => _)
      const { closeWebsocket, startWebsocket, tradePatformApi, webSocketName } = coinPairsDetails
      const { tradePlatform } = tradePatformApi;
      const { name } = tradePlatform
      const { signId, id } = payload

      yield put({ type: 'getList', payload: { coinPairChoiceId: id } })

      yield put({ type: 'updateState', payload: { signId, id } })
      const data = yield call(getCoinPairsChoiceDetail, id)

      console.log(data, '----data')

      const is_true = !(data
        && typeof data === 'object'
        && Reflect.has(data, 'id'))

      if (is_true) {
        return
      }


      if (name === 'huobi') {
        yield closeWebsocket({ webSocketName })
        yield startWebsocket({ symbols: [data.coinPair.name], webSocketName })

        const huobi_data = yield call(huobiMarketDetailMerged, { symbol: data.coinPair.name })

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
          Object.assign(data, new_huobi_data)
        }
      }

      yield updateState({ coinPairChoice: data }, put)

      const info_data = yield call(getSymbol_info, { symbol: data.coinPair.name, signId })

      const info_is_true = !(info_data
        && typeof info_data === 'object'
        && Reflect.has(info_data, 'symbol'))

      if (info_is_true) {
        return
      }

      Object.assign(data, info_data)
      yield updateState({ coinPairChoice: data }, put)
      if (name === 'okex') {
        yield closeWebsocket({ webSocketName })
        yield startWebsocket({ symbols: [data.symbol], webSocketName })
      }
    },

    // 操作处理公共方法
    *handelePublicMethode({ payload }, { put, call, select }) {

      const { coinPairsDetails } = yield select(_ => _)
      const { signId, id, tradePatformApi } = coinPairsDetails

      console.log(signId, id, 'signId, id')

      const { secret, sign, userId } = tradePatformApi;
      const { item, method, success, error } = payload
      const params = {
        secret,
        signId: sign,
        userId,
        symbol: item.coinPair.name,
        coinPairChoiceId: item.id,
        symbol_id: payload.coinPartnerId || '',
      }

      yield updateState({ loading: true }, put)

      let data = yield call(method, params)
      handlerResults(data, success, error)

      yield put({ type: 'getCoinPairsChoiceDetail', payload: { signId, id } })
    },

    // 删除自选货币对
    *deletelFreeCoinPair({ payload }, { put }) {

      let params = {
        item: payload,
        method: deletelFreeCoinPair,
        success: '删除成功！',
        error: '删除失败！'
      }

      yield put({ type: 'handelePublicMethode', payload: params })
    },

    // 开启策略
    *startTrade({ payload }, { put }) {

      let params = {
        item: payload,
        method: startTrade,
        success: '开启策略成功！',
        error: '开启策略失败！'
      }

      yield put({ type: 'handelePublicMethode', payload: params })

    },

    // 暂停买入
    *pauseTrade({ payload }, { put }) {

      let params = {
        item: payload,
        method: pauseTrade,
        success: '暂停买入成功！',
        error: '暂停买入失败！'
      }

      yield put({ type: 'handelePublicMethode', payload: params })
    },

    // 恢复买入
    *recoverBuy({ payload }, { put }) {

      let params = {
        item: payload,
        method: recoverBuy,
        success: '恢复买入成功！',
        error: '恢复买入失败！'
      }

      yield put({ type: 'handelePublicMethode', payload: params })
    },

    // 止盈后停止
    *stopProfitTrade({ payload }, { put }) {

      let params = {
        item: payload,
        method: stopProfitTrade,
        success: '止盈后停止成功！',
        error: '止盈后停止失败！'
      }

      yield put({ type: 'handelePublicMethode', payload: params })
    },

    // 取消止盈后停止
    *cancelStopProfitTrade({ payload }, { put }) {

      let params = {
        item: payload,
        method: cancelStopProfitTrade,
        success: '取消止盈后停止成功！',
        error: '取消止盈后停止失败！'
      }

      yield put({ type: 'handelePublicMethode', payload: params })
    },

    // 立即停止 忘记订单
    *forgetOrders({ payload }, { put }) {

      let params = {
        item: payload,
        method: forgetOrders,
        success: '立即停止 忘记订单成功！！',
        error: '立即停止 忘记订单失败！'
      }

      yield put({ type: 'handelePublicMethode', payload: params })
    },

    // 立即停止 清仓卖出
    *sellAllOrders({ payload }, { put }) {

      let params = {
        item: payload,
        method: sellAllOrders,
        success: '立即停止 清仓卖出成功！',
        error: '立即停止 清仓卖出失败！'
      }

      yield put({ type: 'handelePublicMethode', payload: params })
    },


    // 获取交易参数
    *setDealParamsModalShow({ payload }, { put, call }) {

      const data = yield call(getFreeCoinPairParams, payload.id);
      const is_true = !(data && typeof data === 'object' && Reflect.has(data, 'id'))

      console.log(data, 'setDealParamsModalShow---------')

      if (is_true) {
        yield updateState({ tradeParamForm: {}, isOpenSetTradeParam: true }, put)
        return
      }

      const real_time_earning_ratio = coin_base_four_num(payload.real_time_earning_ratio, payload) || 0;
      console.log(real_time_earning_ratio, 'real_time_earning_ratio')
      const {
        stopProfitTraceTriggerRate,
        stopProfitTraceDropRate,
        stopProfitFixedRate,
        stopProfitType,
        stopProfitMoney,
        coinPairChoiceId,
        id
      } = data;

      let tradeParamForm = {
        stopProfitType: stopProfitType ? Number(data.stopProfitType) : 1,
        stopProfitMoney: stopProfitMoney || 0,
        stopProfitTraceTriggerRate: Math.floor(stopProfitTraceTriggerRate * 10000)/100,
        stopProfitTraceDropRate:  Math.floor(stopProfitTraceDropRate * 10000)/100,
        stopProfitFixedRate:  Math.floor(stopProfitFixedRate * 10000)/100,
        name: payload.coinPair.name,
        real_time_earning_ratio,
        coinPairChoiceId,
        id,
        checkboxProfitMoney:stopProfitMoney !== 0
      }

      yield updateState({ tradeParamForm, isOpenSetTradeParam: true }, put)
    },

    // 设置交易参数
    *setDealParamsModalOk({ payload }, { put, call, select }) {

      const { coinPairsDetails } = yield (select(_ => _));
      const { tradeParamForm } = coinPairsDetails;
      const { secret, sign } = JSON.parse(sessionStorage.getItem('tradePatformApi')) || {};;
      const { id, coinPairChoiceId, name } = tradeParamForm

      console.log(tradeParamForm, 'tradeParamForm=====')

      const { values, form } = payload;

      const {
        stopProfitType,
        stopProfitTraceTriggerRate,
        stopProfitTraceDropRate,
        stopProfitFixedRate,
        stopProfitMoney
      } = values

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


      const new_payload = {
        tradeParamForm: {},
        isOpenSetTradeParam: false
      }

      yield updateState(new_payload, put)
      yield put({ type: 'getCoinPairsChoiceDetail', payload: { signId: coinPairsDetails.signId, id: coinPairsDetails.id } })
      form.resetFields()
    },

    *setDealParamsModalCancel({ payload }, { put }) {
      const { form } = payload;
      const new_payload = {
        tradeParamForm: {},
        isOpenSetTradeParam: false
      }
      yield updateState(new_payload, put)
      form.resetFields()
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
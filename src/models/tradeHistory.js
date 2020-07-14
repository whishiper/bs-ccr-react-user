import {
  orderGroupDetail,
  searchOrderGroup,
  getTradeOverview
} from 'services/app';

import moment from 'moment'
import { numberToChinese } from 'utils'
import { updateState, trade_way } from 'utils/handlerResults'

export default {
  namespace: 'tradeHistory',
  state: {
    moreShow: false,
    time: 'all',
    coinPairChoiceId: 0,
    orderGroupId: '',
    pageSize: 10,
    page: 1,
    total: 0,
    orderGroupData: {},
    orderGroupList: [],
    tradeOrdersList: [],
    overviewData: {}
  },
  effects: {

    *handleTimeChange({ payload }, { put }) {

      yield updateState({ time: payload.target.value, page: 1, orderGroupList: [] }, put)
      yield put({ type: 'searchOrderGroup' })
    },

    *rangePickerOnChange({ payload }, { put }) {
      const [start, end] = payload;
      if (!start || !end) {
        return
      }
      const new_satrt = new Date(new Date(new Date(start.format("YYYY-MM-DD")).toLocaleDateString()).getTime()).getTime()
      const new_end = new Date(new Date(new Date(end.format("YYYY-MM-DD")).toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime()
      yield updateState({ time: `${new_satrt},${new_end}`, page: 1, orderGroupList: [] }, put)
      yield put({ type: 'searchOrderGroup' })
    },

    *handleMoreOrderGroup(_, { put, select }) {
      const { tradeHistory } = yield select(_ => _);
      let { page } = tradeHistory;

      yield updateState({ page: page + 1 }, put)
      yield put({ type: 'searchOrderGroup' })
    },

    *searchOrderGroup(_, { call, select, put }) {
      const { tradeHistory } = yield select(_ => _);
      const { time, coinPairChoiceId, page, pageSize, orderGroupList } = tradeHistory;
      const params = {
        coinPairChoiceId,
        endTime: 0,
        startTime: 0,
        pageNum: page,
        pageSize
      }

      if (time !== 'all') {
        const [startTime, endTime] = time.split(',')
        Object.assign(params, { endTime, startTime })
      }
      const data = yield call(searchOrderGroup, params)

      console.log(data, '-----searchOrderGroup')

      const is_true = !(data
        && typeof data === 'object'
        && Reflect.has(data, 'list')
        && Array.isArray(data.list))


      if (is_true) {
        yield updateState({
          orderGroupList: [],
          orderGroupData: {},
          tradeOrdersList: [],
          total: 0,
          page: 1
        }, put)
        return;
      }

      let newList = [...orderGroupList, ...data.list]


      if (newList.length> 0) {

          newList = newList.sort((a, b) => {
            let A = (new Date(a.createdAt)).getTime()
            let B = (new Date(b.createdAt)).getTime()
            console.log(A-B,'===========')
            return B-A
          })
      }

      console.log(newList,'newList')

      yield updateState({ orderGroupList: newList }, put)

      if (Array.isArray(newList) && newList[0]) {

        yield put({
          type: 'handleOrderGroupChange', payload: {
            orderGroupId: newList[0].id
          }
        })
      } else {
        yield updateState({
          tradeOrdersList: [],
          orderGroupData: {},
        }, put)
      }

    },

    *getTradeOverview({ payload }, { call, put }) {
      const data = yield call(getTradeOverview, payload)

      const is_true = !(data
        && typeof data === 'object'
        && Reflect.has(data, 'coinPairName'))

      if (is_true) {
        yield updateState({ overviewData: {} }, put)
        return
      }
      yield updateState({ overviewData: data }, put)
    },

    *handleOrderGroupChange({ payload }, { put }) {
      yield updateState(payload, put)
      yield put({ type: 'orderGroupDetail', payload })
    },

    *orderGroupDetail({ payload }, { call, put }) {
      const { orderGroupId } = payload
      const data = yield call(orderGroupDetail, orderGroupId)

      const is_true = !(data
        && typeof data === 'object'
        && Reflect.has(data, 'id')
        && Reflect.has(data, 'tradeOrders'))

      if (is_true) {
        yield updateState({ tradeOrdersList: [], orderGroupData: {} }, put)
        return
      }

      const size = data.tradeOrders.length
      const tradeOrdersList = data.tradeOrders.map((item, index) => {
        const tradeType = Number(item.tradeType)
        const { tradeAveragePrice, tradeNumbers, tradeCost, sellProfit } = item
        const is_new_true = tradeType === 2 || tradeType === 3 || tradeType === 4

        return {
          key: item.id,
          new_name: is_new_true ? '结单' : `第${numberToChinese(size - index)}单`,
          tradeType: trade_way(item.tradeType),
          tradeAveragePrice: tradeType === 4 ? '---' : tradeAveragePrice,
          tradeNumbers: tradeType === 4 ? '---' : tradeNumbers,
          tradeCost: tradeType === 4 ? '---' : tradeCost,
          sellProfit: tradeType === 2 || tradeType === 3 ? sellProfit : '---',
          createdAt: moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss"),
          type: tradeType
        }
      })

      yield updateState({
        orderGroupData: data,
        tradeOrdersList: tradeOrdersList.filter(item => item.type !== 3).filter(item => item.type !== 4)
      }, put)
    },

    *oPaginationChange({ payload }, { put }) {

      yield updateState({ page: payload }, put)
      // yield put({ type: 'searchOrderGroup' })
    },

  },
  reducers: {

    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    }

  },


}
import {
  getCoinPairChoiceChoiceList,
  getBuyLogs,
  getBuyTotal
} from 'services/app';
// import {getDate} from 'utils/getDate';
import moment from 'moment'
import { updateState } from 'utils/handlerResults'

export default {
  namespace: 'buyLogs',
  state: {
    moreShow: false,
    coinPairChoiceList: [],
    activeCoinPairChoice: [],
    time: 'all',
    pageSize: 10,
    page: 1,
    total: 20,
    profitList: [],
    coinPair: [],
    profitSumUp: {},
    coinName: ''
  },
  effects: {

    *hadleTabsChange({ payload }, { put }) {

      const { robotBindApiId, tabsActive, coinName } = payload

      yield put({
        type: 'global/updateState', payload: { tabsActive }
      })

      yield updateState({ moreShow: false, time: 'all', coinName }, put)
      yield put({
        type: 'getCoinPairChoiceChoiceList',
        payload: {
          tradePlatformApiBindProductComboId: robotBindApiId,
          coinId: tabsActive,
          coinName
        }
      })

    },



    *getCoinPairChoiceChoiceList({ payload }, { call, put, select }) {
      const params = Object.assign(payload, { type: 'buy' })

      yield updateState({ coinName: payload.coinName }, put)

      const { list = [] } = yield call(getCoinPairChoiceChoiceList, params)

      const coinPair = list
        ?
        list.map(item => {
          return {
            id: item.coinPairChoiceId,
            name: item.coinPairName,
            checked: false,
          }
        })
        :
        [];

      const activeCoinPairChoice = list
        ?
        list.map(item => {
          return {
            id: item.coinPairChoiceId,
            name: item.coinPairName,
            checked: true,
          }
        })
        :
        [];

      yield updateState({ coinPair, activeCoinPairChoice,page:1 }, put)

      yield put({ type: 'getBuyLogs' })

    },

    *getBuyLogs(_, { call, select, put }) {
      const { buyLogs } = yield select(_ => _);
      const { activeCoinPairChoice, time } = buyLogs;

      const coinPairChoice = []
      activeCoinPairChoice.forEach(item => {
        if (item.checked) {
          coinPairChoice.push(item.id)
        }
        return item
      })

      const coinPairChoiceIds = coinPairChoice.join(',')

      if (!coinPairChoiceIds) {
        yield updateState({ profitList: [], profitSumUp: {}, total: 0 }, put)
        return
      }

      const params = {
        coinPairChoiceIds,
        pageNum: buyLogs.page,
        pageSize: buyLogs.pageSize
      }

      if (time !== 'all') {
        const [startTime, endTime] = time.split(',')
        Object.assign(params, { endTime, startTime })
      }

      const { list = [], total = 0 } = yield call(getBuyLogs, params)

      const profitList = list
        ?
        list.map(item => {
          if (Number(item.tradeType) === 1) {
            item.tradeType = 'AI建仓'
          } else if (Number(item.tradeType) === 2) {
            item.tradeType = 'AI整体止盈'
          } else if (Number(item.tradeType) === 3) {
            item.tradeType = '手动清仓'
          }
          return Object.assign(item, { key: item.id, createAt: moment(item.createAt).format("YYYY-MM-DD HH:mm:ss") })
        })
        :
        []

      yield updateState({ profitList,  total }, put)

      yield put({
        type: 'getBuyTotal', payload: {
          coinPairChoiceIds: coinPairChoice.join(','),
        }
      })

    },

    *handleTimeChange({ payload }, { put, select }) {
      const { buyLogs: { activeCoinPairChoice } } = yield select(_ => _);

      yield updateState({ time: payload.target.value, activeCoinPairChoice, page: 1 }, put)


      yield put({ type: 'getBuyLogs' })
    },

    *rangePickerOnChange({ payload }, { put, select }) {
      const { buyLogs: { activeCoinPairChoice } } = yield select(_ => _);
      const [start, end] = payload;

      if (!start || !end) {
        return
      }

      const new_satrt = new Date(new Date(new Date(start.format("YYYY-MM-DD")).toLocaleDateString()).getTime()).getTime()
      const new_end = new Date(new Date(new Date(end.format("YYYY-MM-DD")).toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime()

      yield updateState({ time: `${new_satrt},${new_end}`, activeCoinPairChoice, page: 1 }, put)

      yield put({ type: 'getBuyLogs' })
    },

    *getBuyTotal({ payload }, { call, put }) {
      const data = yield call(getBuyTotal, payload)

      yield updateState({ profitSumUp: data || {} }, put)
    },

    *handleCoinPairChange({ payload }, { put, select }) {
      const { buyLogs: { coinPair } } = yield select(_ => _);

      let activeCoinPairChoice = []
      coinPair.map(item => {
        activeCoinPairChoice.push({ ...item, checked: true })
        if (payload.id === item.id) {
          item.checked = !item.checked
        }
        return item
      })

      const activeCoinPair = coinPair.filter(item => item.checked === true)

      if (JSON.stringify(activeCoinPair) !== '[]') {
        activeCoinPairChoice = activeCoinPair
      }

      yield updateState({ coinPair, activeCoinPairChoice: coinPair, page: 1 }, put)

      yield put({ type: 'getBuyLogs' })
    },

    *handleAllCoinPair({ payload }, { put, select }) {
      const { buyLogs: { coinPair } } = yield select(_ => _);

      coinPair.map(item => {
        item.checked = true
        return item
      })

      yield updateState({ coinPair, activeCoinPairChoice: coinPair, page: 1 }, put)

      yield put({ type: 'getBuyLogs' })
    },

    *handleCancelAllCoinPair({ payload }, { put, select }) {
      console.log('000')
      const { buyLogs: { coinPair } } = yield select(_ => _);

      coinPair.map(item => {
        item.checked = false
        return item
      })

      yield updateState({ coinPair, page: 1 }, put)
      yield put({ type: 'getBuyLogs' })
    },

    *oPaginationChange({ payload }, { put }) {

      yield updateState({ page: payload }, put)
      yield put({ type: 'getBuyLogs' })
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
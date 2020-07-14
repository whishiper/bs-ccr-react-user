import {
  getCoinPairChoiceChoiceList,
  getProfitList,
  getProfitSummary
} from 'services/app';
// import {getDate} from 'utils/getDate';
import moment from 'moment'
import { updateState, trade_way } from 'utils/handlerResults'

export default {
  namespace: 'profitSummary',
  state: {
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

    *hadleTabsChange({ payload }, { put, call }) {
      const { robotBindApiId, tabsActive, coinName } = payload

      yield put({
        type: 'global/updateState', payload: { tabsActive }
      })

      yield put({
        type: 'updateState', payload: {
          moreShow: false, time: 'all', coinName
        }
      })

      yield put({
        type: 'getCoinPairChoiceChoiceList', payload: {
          tradePlatformApiBindProductComboId: robotBindApiId,
          coinId: tabsActive,
          coinName
        }
      })

    },

    *getCoinPairChoiceChoiceList({ payload }, { call, put, select }) {

      yield updateState({ coinName: payload.coinName }, put)

      const params = Object.assign(payload, { type: 'profit' })

      const data = yield call(getCoinPairChoiceChoiceList, params)
      const is_true = !(typeof data === 'object'
        && Reflect.has(data, 'list')
        && data.list
        && JSON.stringify(data.list) !== '[]')

      if (is_true) {
        yield updateState({
          coinPair: [],
          profitList: [],
          profitSumUp: {},
          activeCoinPairChoice: []
        }, put)
        return;
      }
      yield updateState({
        coinPair: data.list.map(item => {
          return {
            id: item.coinPairChoiceId,
            name: item.coinPairName,
            checked: false,
          }
        }),
        activeCoinPairChoice: data.list.map(item => {
          return {
            id: item.coinPairChoiceId,
            name: item.coinPairName,
            checked: true,
          }
        }),
        page: 1
      }, put)
      yield put({ type: 'getProfitList' })

    },

    *getProfitList(_, { call, select, put }) {
      const { profitSummary } = yield select(_ => _);
      const { pageSize, page, activeCoinPairChoice, time } = profitSummary;
      const coinPairChoice = []
      activeCoinPairChoice.forEach(item => {
        if (item.checked) {
          coinPairChoice.push(item.id)
        }
        return item
      })

      const params = {
        coinPairChoiceIds: coinPairChoice.join(','),
        pageNum: page,
        pageSize
      }

      if (time !== 'all') {
        const [startTime, endTime] = time.split(',')
        Object.assign(params, { endTime, startTime })
      }

      const data = yield call(getProfitList, params)

      const is_true = !(typeof data === 'object'
        && Reflect.has(data, 'list')
        && data.list !== null
        && JSON.stringify(data.list) !== '[]')

      if (is_true) {
        yield updateState({
          profitList: [],
          profitSumUp: {},
          total: 0
        }, put)
        return;
      }

      const profitList = data.list.map(item => {
        return Object.assign(item, {
          key: item.id,
          tradeType: trade_way(item.tradeType),
          createAt: moment(item.createAt).format("YYYY-MM-DD HH:mm:ss"),
          type: Number(item.tradeType)
        })
      })

      yield updateState({
        profitList: profitList.filter(item => item.type !== 3).filter(item => item.type !== 4),
        total: data.total
      }, put)

      yield put({
        type: 'getProfitSummary', payload: {
          coinPairChoiceIds: coinPairChoice.join(','),
        }
      })
    },

    *handleTimeChange({ payload }, { put, select }) {
      const { profitSummary } = yield select(_ => _);
      const { activeCoinPairChoice } = profitSummary;
      yield updateState({ time: payload.target.value, activeCoinPairChoice, page: 1 }, put)
      yield put({ type: 'getProfitList' })
    },

    *rangePickerOnChange({ payload }, { put, select }) {
      const { profitSummary } = yield select(_ => _);
      const { activeCoinPairChoice } = profitSummary;
      const [start, end] = payload;
      if (!start || !end) {
        return
      }
      const new_satrt = new Date(new Date(new Date(start.format("YYYY-MM-DD")).toLocaleDateString()).getTime()).getTime()
      const new_end = new Date(new Date(new Date(end.format("YYYY-MM-DD")).toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime()
      yield updateState({ time: `${new_satrt},${new_end}`, activeCoinPairChoice, page: 1 }, put)
      yield put({ type: 'getProfitList' })
    },

    *getProfitSummary({ payload }, { call, put }) {
      const data = yield call(getProfitSummary, payload)

      yield updateState({ profitSumUp: data || {} }, put)
    },

    *handleCoinPairChange({ payload }, { put, select }) {
      const { profitSummary } = yield select(_ => _);
      const { coinPair } = profitSummary;
      let activeCoinPairChoice = []
      coinPair.map(item => {
        if (payload.id === item.id) {
          item.checked = !item.checked
        }
        return item
      })
      activeCoinPairChoice = coinPair.filter(item => item.checked === true)
      console.log(activeCoinPairChoice, 'activeCoinPairChoice')
      yield put({
        type: 'updateState', payload: {
          coinPair,
          activeCoinPairChoice,
          page: 1
        }
      })
      yield put({ type: 'getProfitList' })

    },

    *handleAllCoinPair({ payload }, { put, select }) {
      const { profitSummary } = yield select(_ => _);
      const { coinPair } = profitSummary;

      coinPair.map(item => {
        item.checked = true
        return item
      })

      yield updateState({ coinPair, activeCoinPairChoice: coinPair, page: 1 }, put)
      yield put({ type: 'getProfitList' })

    },
    *handleCancelAllCoinPair({ payload }, { put, select }) {
      const { profitSummary } = yield select(_ => _);
      const { coinPair } = profitSummary;

      coinPair.map(item => {
        item.checked = false
        return item
      })

      yield updateState({ coinPair, page: 1 }, put)

      yield put({ type: 'getProfitList' })

    },

    *oPaginationChange({ payload }, { put }) {

      yield updateState({ page: payload }, put)
      yield put({ type: 'getProfitList' })
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
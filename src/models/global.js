import { getTradePatformApi, coinSort } from 'services/app';
import { updateState } from 'utils/handlerResults'

export default {
  namespace: 'global',
  state: {
    moreShow: false,
    tradePatformInfo: {},
    coinSortList: [],
    tabsActive: '',
  },

  effects: {

    *start({ payload }, { put }) {
      const { tradePlatformId, robotBindApiId, tradePatformApiId, fn } = payload;

      yield put({
        type: 'getCoinSort', payload: {
          tradePlatformId,
          robotBindApiId,
          fn
        }
      })

      yield put({
        type: 'getTradePatformInfo', payload: {
          tradePatformApiId
        }
      })
    },

    // 交易平台信息
    *getTradePatformInfo({ payload }, { put, call }) {

      const { tradePatformApiId } = payload;
      const data = yield call(getTradePatformApi, tradePatformApiId);

      const is_true = !(typeof data === 'object' && Reflect.has(data, 'id'))

      if (is_true) {
        return;
      }

      sessionStorage.setItem('tradePatformInfo', JSON.stringify(data));

      yield updateState({ tradePatformInfo: data }, put)
    },

    // 计价货币排序列表
    *getCoinSort({ payload }, { put, call }) {
      const { tradePlatformId, robotBindApiId, fn } = payload;

      const data = yield call(coinSort, { tradePlatformId, type: 1 });
      console.log('----getCoinSort--')

      const is_true = !(typeof data === 'object'
        && Reflect.has(data, 'list')
        && JSON.stringify(data.list) !== '[]')

      if (is_true) {
        return;
      }

      const tabsActive = data.list[0].coin.id
      const coinName = data.list[0].coin.name

      yield updateState({ coinSortList: data.list, tabsActive, coinName }, put)

      if (fn) {
        const { type } = fn
        yield put({
          type, payload: {
            tabsActive,
            robotBindApiId,
            coinName
          }
        })
      }

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
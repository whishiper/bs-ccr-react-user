/* global window */
/* global document */
/* global location */
/* eslint no-restricted-globals: ["error", "event"] */

// import { routerRedux } from 'dva/router';
export default {
  namespace: 'app',
  state: {
    role: 'user',
    collapsed: false,
    isLogin: sessionStorage.getItem('access_token') && sessionStorage.getItem('userInfo')
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        console.log(pathname, '----pathname')
        if('/ccr/user/api' === pathname ) {
          sessionStorage.removeItem('tradePatformApi');
          sessionStorage.removeItem('freeCoinPairList');
          sessionStorage.removeItem('robotId')
          sessionStorage.removeItem('tradePlatformApiBindProductComboId')
        }
      })

    }
  },
  effects: {


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

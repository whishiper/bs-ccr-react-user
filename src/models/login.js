import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { userLogin,batchStopProfit, byTelGetUserInfo } from 'services/app';
import { updateState } from 'utils/handlerResults'

export default {
  namespace: 'login',
  state: {
    activeKey: 'account',
    iconLoading: false
  },
  effects: {

    *handleLoginSubmit({ payload }, { call, put, select }) {

      const { values } = payload;
      const { tel, password } = values
      const { login } = yield (select(_ => _))

      yield updateState({ iconLoading: true }, put)
      if (login.activeKey === 'account') {

        const loginToken = yield call(userLogin, { username: tel, password });

        if (!(typeof loginToken === 'object'
          && Reflect.has(loginToken, 'access_token')
          && Reflect.has(loginToken, 'expires_in'))) {
          yield updateState({ iconLoading: false }, put)
          return
        }

        sessionStorage.setItem('access_token', Reflect.get(loginToken, 'access_token'))

        const userInfo = yield call(byTelGetUserInfo, { tel });

        if (!(typeof userInfo === 'object'
          && Reflect.has(userInfo, 'id')
          && Reflect.has(userInfo, 'tel'))) {
          yield updateState({ iconLoading: false }, put)
          return
        }
        yield call(batchStopProfit,{userId: String(userInfo.id)})
        yield updateState({ iconLoading: false }, put)
        yield sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
        yield put(routerRedux.push('/ccr/user/api'))
        yield message.success('登陆成功！');
      }
    },

    *loginout(_, { put }) {

      yield put(routerRedux.replace('/login'))
      sessionStorage.clear()
    }


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

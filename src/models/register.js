import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { Register_code, userRegister } from 'services/app';
import { updateState } from 'utils/handlerResults'

export default {
  namespace: 'register',
  state: {
    activeKey: 'account',
    password: '',
    lastpassword: '',
    visible: false,
    iconLoading: false,
  },
  effects: {

    *registerCode({ payload }, { call }) {

      const data = yield call(Register_code, payload);

      if (data !== null
        && typeof data === 'object'
        && Reflect.has(data, 'Message')
        && Reflect.get(data, 'Message') === 'OK'
      ) {
        message.success('发送验证码成功！');

      }

    },

    *handleLoginSubmit({ payload }, { call, put }) {

      const { values } = payload;

      yield updateState({ iconLoading: true }, put)

      const register = yield call(userRegister, values);

      if (!(register
        && typeof register === 'object'
        && Reflect.has(register, 'msg')
        && Reflect.has(register, 'data')
        && Reflect.get(register, 'data') === 1)
      ) {
        let error = register.msg || '注册失败'
        message.error(error)
        yield updateState({ iconLoading: false }, put)
        return;
      }

      yield updateState({ iconLoading: false }, put)
      message.success('注册成功！');
      yield put(routerRedux.push('/'));

    }

  },

  reducers: {

    updateState(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },

  }
};

import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { updateState } from 'utils/handlerResults'
import { verifyPasswordCode, forgetPassword } from 'services/app';


export default {
  namespace: 'forget',
  state: {
    iconLoading: false
  },
  subscriptions: {},
  effects: {

    *forgetCode({ payload }, { call, put }) {
      const data = yield call(verifyPasswordCode, payload);

      const is_true = !(typeof data === 'object' && Reflect.has(data, 'Message') && Reflect.get(data, 'Message') === 'OK')

      if (is_true) {
        message.error(Reflect.get(data, 'Message'));
        return;
      }
      message.success('发送验证码成功！');

    },

    *handleLoginSubmit({ payload }, { call, put, select }) {
      const { values, form } = payload;
      yield updateState({ iconLoading: true }, put)
      const params = {
        tel: values.tel,
        password: values.password,
        lastpassword: values.lastpassword,
        code: values.code
      };

      const data = yield call(forgetPassword, params);

      if (!(data
        && typeof data === 'object'
        && Reflect.has(data, 'msg')
        && Reflect.has(data, 'data')
        && Reflect.get(data, 'data') === 1
        && Reflect.get(data, 'msg') === 'success')
      ) {
        message.error('修改密码失败！');
        yield updateState({ iconLoading: false }, put)
        return;
      }

      yield updateState({ iconLoading: false }, put)
      yield put(routerRedux.push('/login'));
      message.success('修改密码成功！');
      form.resetFields();
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

import {
  getApiList,
  getTradePlatformList,
  addApi,
  getApiDetail,
  editApi,
  deleteApi,
} from 'services/app';

import { encrypt } from 'utils'
import { handlerResults, updateState } from 'utils/handlerResults'

export default {
  namespace: 'api',
  state: {
    loading: false,
    apiFormLoading: false,
    formVisible: false,
    formData: {},
    tradeName: '',
    formType: 'add',
    page: 1,
    pageSize: 10,
    total: 0,
    apiList: [{ key: -1 }],
    tradePlatList: []
  },

  subscriptions: {},

  effects: {

    *start(_, { put }) {
      yield put({ type: "getApiList" });
      yield put({ type: "getTradePlatformList" });
    },

    // 获取 api 列表
    *getApiList(_, { put, call, select }) {

      const { api: { page } } = yield select(_ => _);
      yield updateState({ loading: true }, put)

      const params = { pageNum: page };
      const data = yield call(getApiList, params);

      const is_true = !(data
        && typeof data === 'object'
        && Reflect.has(data, 'list')
        && Array.isArray(data.list))

      const list = is_true ? [] : data.list

      console.log(list,'-----list')

      yield updateState({
        apiList: [...list, { key: -1 }],
        loading: false
      }, put)

    },

    *getTradePlatformList(_, { put, call }) {

      const data = yield call(getTradePlatformList, { pageNum: 1 });
      const is_true = !(data
        && typeof data === 'object'
        && Reflect.has(data, 'list')
        && Array.isArray(data.list))

      const list = is_true ? [] : data.list
      yield updateState({ tradePlatList: list }, put)

    },

    *addApiFormShow(_, { put, select }) {

      const { api: { tradePlatList } } = yield select(_ => _);

      const tradePlatformId = tradePlatList.length !== 0 ? tradePlatList[0].id : '';
      const tradeName = tradePlatList.length !== 0 ? tradePlatList[0].name : '';

      yield updateState({
        formVisible: true,
        formType: "add",
        tradeName,
        formData: {
          tradePlatformId
        }
      }, put)

    },

    *editApiFormShow({ payload }, { put }) {

      yield put({ type: "getApiDetail", payload });

    },

    *getApiDetail({ payload }, { put, call, select }) {

      const { api } = yield select(_ => _);
      const { tradePlatList } = api
      let data = yield call(getApiDetail, payload.id);

      const is_true = !(data
        && typeof data === 'object'
        && Reflect.has(data, 'id'))

      if (is_true) {
        data = {}
      }

      const { tradePlatformId = '', accessKey = '', secretKey = '', nickname = '', id = '' } = data
      const formData = { tradePlatformId, accessKey, secretKey, nickname, id }
      const item = tradePlatList.find(item => Number(item.id) === Number(tradePlatformId))

      yield updateState({ formData, tradeName: item.name || '', formVisible: true, formType: "edit" }, put)

    },

    *handleFormOk({ payload }, { put, call, select }) {

      const { api: { formData, tradePlatList } } = yield select(_ => _);
      const { values, form } = payload;
      const { accessKey, secretKey, tradePlatformId, nickname, sign, pass } = values;
      const { id } = formData;
      yield updateState({ apiFormLoading: true }, put)

      console.log(formData, '---formData')

      const tradePlatItem = tradePlatList.find(item => Number(tradePlatformId) === Number(item.id)) || {}
      const secretText = tradePlatItem.name === 'okex' ? `${accessKey.trim()}_${secretKey.trim()}_${pass.trim()}` : `${accessKey.trim()}_${secretKey.trim()}`

      const params = {
        nickname,
        tradePlatformId,
        plantFormName: tradePlatItem.name.toLowerCase(),
        secret: encrypt(secretText)
      }

      if (tradePlatItem.name === 'okex') {
        Object.assign(params, { sign })
      }

      if (id) {
        Object.assign(params, { id })
      }

      let method = id ? editApi : addApi

      const data = yield call(method, params);

      yield updateState({ apiFormLoading: false }, put)

      const successText = id ? '编辑成功！' : '添加成功！'
      handlerResults(data, successText, '');

      yield put({ type: 'getApiList' })
      yield updateState({ formVisible: false }, put)
      form.resetFields()
    },

    *handleFormCancel({ payload }, { put }) {

      const { form } = payload
      yield updateState({ formVisible: false }, put)
      form.resetFields()
    },

    *deleteApi({ payload }, { put, call }) {

      const { id,sign,tradePlatform } = payload
      
      const params ={
        id: String(id),
        signId:sign,
        plantFormName: tradePlatform.name
      }
      const data = yield call(deleteApi,params);
      handlerResults(data, '删除成功！', '');

      yield put({ type: "getApiList" });
    }
  },

  reducers: {

    updateState(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }

  }
};

import {
  getIp,
  handleActiveCode,
  getRobotList,
  bindApi,
  unbinddApi,
  getApiList,
} from 'services/app';
import { handlerResults, updateState } from 'utils/handlerResults'

export default {
  namespace: 'ccr',
  state: {
    loading: false,
    activationVisible: false,
    resultVisible: false,
    prompt_box_visible: false,
    iPExplainVisible: false,
    robotExplainVisible: false,
    prompt_box_text: '',
    validation_api_type: 'error',
    pageSize: 10,
    page: 1,
    total: 20,
    robotList: [],
    apiList: [],
    ipArray: []
  },
  effects: {

    *start(_, { put }) {

      yield updateState({ robotList: [] }, put)
      yield put({ type: 'getRobotList' })
      yield put({ type: 'getApiList' })
    },

    *handleActiveCode({ payload }, { put, call }) {

      const { form, values } = payload
      const data = yield call(handleActiveCode, values)

      const is_true = !(data
        && typeof data === 'object'
        && Reflect.has(data, 'data')
        && Reflect.get(data, 'data') === 1)

      if (is_true) {
        yield updateState({
          prompt_box_visible: true,
          prompt_box_text: data && data.msg ? data.msg : '激活失败',
          validation_api_type: 'error',
        }, put)

        return
      }

      yield updateState({
        prompt_box_visible: true,
        prompt_box_text: data.msg,
        validation_api_type: 'success',
        activationVisible: false
      }, put)

      yield put({ type: 'getRobotList' })
      form.resetFields()
    },

    // 获取API列表
    *getApiList(_, { put, call }) {

      const params = { pageNum: 1 }

      const data = yield call(getApiList, params)
      const is_true = !(data && typeof data === 'object' && Reflect.has(data, 'list') && Array.isArray(data.list))
      yield updateState({ apiList: is_true ? [] : data.list }, put)
    },

    // CCR智能交易机器人绑定 api 列表
    *getRobotList(_, { put, call, select }) {

      const { ccr: { pageSize, page } } = yield (select(_ => _))
      const params = {
        pageSize,
        pageNum: page,
      }

      yield updateState({ loading: true }, put)

      let data = yield call(getRobotList, params);
      const is_true = !(data && typeof data === 'object' && Reflect.has(data, 'list') && Array.isArray(data.list))

      if (is_true) {
        yield updateState({
          robotList: [],
          loading: false,
          ipArray: []
        }, put)
        return
      }

      yield updateState({
        robotList: data.list.map(item => Object.assign(
          item, { ip: '', serverIp: '' })),
        loading: false,
        ipArray: []
      }, put)

      const allPromise = []
      const ipArray = new Set();

      for (const item of data.list) {

        if (item.tradePlatformName === 'huobi') {
          const item_promise = new Promise(async resolve => {
            const ip_data = await getIp({ robotId: item.userProductComboId })

            const ip_is_true = ip_data && typeof ip_data === 'object' && Reflect.has(ip_data, 'address')

            let ip_object = { ip: '', serverIp: '' }
            if (ip_is_true) {
              const { address = '', serverIp = '' } = ip_data
              const ip = address ? address.split(':')[0] : ''
              ipArray.add(ip).add(serverIp)
              ip_object = { ip, serverIp }
            }
            Object.assign(item, ip_object)

            resolve(item)
          })
          allPromise.push(item_promise)
        }

      }

      yield Promise.all(allPromise);

      yield updateState({
        robotList: data.list,
        loading: false,
        ipArray: [...ipArray]
      }, put)

    },

    *setApiFromShow({ payload }, { put, select }) {

      const { ccr } = yield (select(_ => _))
      const { cardItem } = payload;

      const robotList = ccr.robotList.map(item => Object.assign(item, {
        isShowSetApiFrom: item.userProductComboId === cardItem.userProductComboId
      }))

      yield updateState({ robotList }, put)
    },

    *setApiFromHide(_, { put, select }) {

      const { ccr } = yield (select(_ => _))

      const robotList = ccr.robotList.map(item => Object.assign(item, { isShowSetApiFrom: false }))

      yield updateState({ robotList }, put)
    },

    *handleSetApiFromSubmit({ payload }, { put }) {

      const { values } = payload
      const { apiId } = values
      let method = apiId !== 'unbound' ? 'bindApi' : 'unbinddApi'

      yield put({ type: method, payload })
    },

    // 绑定 api
    *bindApi({ payload }, { put, call, select }) {
      const { ccr: { apiList } } = yield (select(_ => _))

      const { values: { apiId }, form, cardItem } = payload
      const apiItem = apiList.find(item => item.id === apiId)
      const { secret, id, tradePlatform, sign } = apiItem;

      const params = {
        id: String(id),
        secret,
        plantFormName: tradePlatform.name,
        tradePlatformApiId: String(apiId),
        userProductComboId: String(cardItem.userProductComboId)
      }

      if (tradePlatform.name === 'okex') {
        Object.assign(params, { sign })
      }

      yield updateState({ loading: true }, put)

      const data = yield call(bindApi, params)

      const success_msg = cardItem.tradePlatformApi ? '更换api成功！' : '设置api成功！';
      const error_msg = cardItem.tradePlatformApi ? '更换api失败！' : '设置api失败！'
      const is_true = handlerResults(data, success_msg, error_msg)
      yield updateState({ loading: false }, put)

      if (is_true) {
        yield put({ type: 'getRobotList' })
        yield put({ type: 'getApiList' })
      }

      form.resetFields()
    },

    // 解除 api 绑定
    *unbinddApi({ payload }, { put, call }) {
      const { form, cardItem } = payload
      const { tradePlatformApiBindProductComboId, tradePlatformApiId, tradePlatformName } = cardItem

      const params = {
        tradePlatformApiBindProductComboId: String(tradePlatformApiBindProductComboId),
        id: String(tradePlatformApiId),
        plantFormName: tradePlatformName,
      }

      const data = yield call(unbinddApi, params);
      const is_true = handlerResults(data, '解绑api成功', '解绑api失败')

      if (is_true) {
        yield put({ type: 'getRobotList' })
        yield put({ type: 'getApiList' })
        form.resetFields()
      }
    },

    *handleSetApiFromCancel({ payload }, { put, select }) {

      const { form } = payload
      const { ccr } = yield (select(_ => _))

      const robotList = ccr.robotList.map(item => Object.assign(
        item,
        { isShowSetApiFrom: false })
      )

      yield updateState({ robotList }, put)
      form.resetFields()
    },

    *oPaginationChange({ payload }, { put }) {

      yield updateState({ page: payload }, put)
    },

    *onShowSizeChange({ payload }, { put }) {

      const { size, current } = payload
      yield updateState({ pageSize: size, page: current }, put)
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
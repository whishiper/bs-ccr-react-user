// import React from 'react';
import { message } from 'antd';
import {
  getSymbol_info,
  huobiMarketDetailMerged
} from 'services/app';
import { debounce, throttle, cloneDeep } from 'lodash'

// 处理操作返回的结果
export function handlerResults(data, success_msg, error_msg) {
  // console.log(typeof data, 'data')

  const is_true = !(data
    && typeof data === 'object'
    && Reflect.has(data, 'msg')
    && Reflect.get(data, 'msg') === 'success'
    && Reflect.has(data, 'data')
    && Number(Reflect.get(data, 'data')) !== 0
  )

  if (is_true) {
    const { msg } = data || {};

    if (!error_msg) { return false }

    message.error(msg || error_msg);
    return false;
  }

  message.success(success_msg)
  return true
}

// 更新数据
export function* updateState(payload, put) {

  yield put({ type: "updateState", payload });
}

// 是否开始策略
export const is_start_trade = ( trade_status) => {
  return Number(trade_status) === 0
}

// 是否暂停买入
export const is_stop_buy = (trade_status) => {
  return trade_status && Number(trade_status) === 3 ? 'block' : 'none'
}

// 恢复买入
export const is_resume_buy = (trade_status) => {
  return trade_status && Number(trade_status) === 3
}


// 监视买入 
export const is_monitor_buy = (trade_status, is_set_stop_profit_trade) => {
  return trade_status
    && (Number(trade_status) === 1 || is_set_stop_profit_trade && Number(is_set_stop_profit_trade) === 2)
    ?
    'block'
    :
    'none'
}

// 止盈后停止
export const is_stop_profit_stop = (is_set_stop_profit_trade) => {
  return is_set_stop_profit_trade && Number(is_set_stop_profit_trade) === 1
    ?
    'block'
    :
    'none'
}

// 交易货币不足
export const is_insufficient_transaction_currency = (trade_status, symbol_balance, position_num) => {
  return Number(trade_status) !== 0
    && symbol_balance
    && Reflect.has(symbol_balance, 'balance')
    && position_num
    && Number(symbol_balance.balance) < Number(position_num) * 0.97
    ?
    'block'
    :
    'none'
}

// 交易方式
export const trade_way = (value) => {
  let new_value = ''

  if (Number(value) === 1) {
    new_value = 'AI建仓'
  } else if (Number(value) === 2) {
    new_value = 'AI整体止盈'
  } else if (Number(value) === 3) {
    new_value = '手动清仓'
  } else if (Number(value) === 4) {
    new_value = '忘记订单'
  }

  return new_value
}

// 实时收益比
export const realTimeEarningRatio = ({
  finished_order,
  real_time_earning_ratio = 0,
  node_calc_real_time_earning_ratio = 0
}) => {
  if (finished_order && Number(finished_order) !== 0) {

    if (real_time_earning_ratio
      && Number(real_time_earning_ratio) !== 0) {
      return Number(real_time_earning_ratio).toFixed(4)

    } else if (node_calc_real_time_earning_ratio
      && Number(node_calc_real_time_earning_ratio) !== 0) {
      return Number(node_calc_real_time_earning_ratio).toFixed(4)
    }
  }

  return 0
}

// 显示收益颜色

export const real_time_earning_ratio_color = ({ real_time_earning_ratio, node_calc_real_time_earning_ratio }) => {
  let color = '#000'

  if (real_time_earning_ratio) {
    if (Number(real_time_earning_ratio) >= 1) {
      color = '#3f8600'
      return color
    } else {
      return color
    }
  }

  if (node_calc_real_time_earning_ratio) {
    if (Number(node_calc_real_time_earning_ratio) >= 1) {
      color = '#3f8600'
      return color
    } else {
      return color
    }
  }
}


export const HUOBI_ERRORS = {
  'api-signature-not-valid': 'API签名错误',
  'gateway-internal-error': '系统繁忙，请稍后再试',
  'order-accountbalance-error': '账户余额不足',
  'order-limitorder-price-error': '限价单下单价格超出限制',
  'order-limitorder-amount-error': '限价单下单数量超出限制',
  'order-orderprice-precision-error': '下单价格超出精度限制',
  'order-orderamount-precision-error': '下单数量超过精度限制',
  'order-marketorder-amount-error': '下单数量超出限制',
  'order-queryorder-invalid': '查询不到此条订单',
  'order-orderstate-error': '订单状态错误',
  'order-datelimit-error': '查询超出时间限制',
  'order-update-error': '订单更新出错',
  'order-value-min-error': '下单金额小于最小交易额'
};


// 获取 自选币 redis信息 
const symbolRedis = async (item, sign, signal) => {
  const symbol_redis_promise = new Promise(async resolve => {

    const info_data = await getSymbol_info({ symbol: item.coinPair.name, signId: sign, signal })

    const info_is_true = info_data
      && typeof info_data === 'object'
      && Reflect.has(info_data, 'symbol')


    if (info_is_true) {

      resolve(Object.assign(info_data, { loading: false, new_item_symbol: item.coinPair.name }))
    } else {
      resolve({ loading: false, new_item_symbol: item.coinPair.name })
    }

  })

  return await symbol_redis_promise
}

// 获取 火币自选币 最新报价
const symbolPrice = async (item, signal) => {

  const huobi_symbol_price_promise = new Promise(async resolve => {
    const price = await huobiMarketDetailMerged({ symbol: item.coinPair.name, signal })

    const is_huobi_true = price
      && typeof price === 'object'
      && Reflect.has(price, 'tick')
      & Reflect.has(price.tick, 'bid')

      let new_price = {
        openPrice: 0,
        buyPrice: 0,
        sellPrice: 0,
        new_item_symbol: item.coinPair.name,
        loading: false
      }

    if (is_huobi_true) {
      const { tick } = price
      const { bid, ask } = tick
       new_price = {
        openPrice: bid[0],
        buyPrice: bid[0],
        sellPrice: ask[0],
        new_item_symbol: item.coinPair.name,
        loading: false,
      }
    } 
    resolve(new_price)

  })

  return await huobi_symbol_price_promise
}

// 获取多个 货币对 最新报价 和 redis信息 公共方法
const getSymbolsInfo = async (list, sign, signal, fn) => {

  const is_array_true = !(Array.isArray(list) && list.length > 0)

  console.log(list, 'getSymbolsInfo------list')

  if (is_array_true) {
    return []
  }

  let array_promise = []

  for (let item of cloneDeep(list)) {
    const is_true = typeof item === 'object'
      && Reflect.has(item, 'coinPair')
      && item.coinPair !== null
      && typeof item.coinPair === 'object'

    if (is_true) {

      array_promise.push(fn(item, sign, signal))
    }
  }

  return await Promise.all(array_promise)
}

// 获取 多个货币对 redis 信息
export const getSymbolsRedis = async (list, sign, signal) => {
  return await getSymbolsInfo(list, sign, signal, symbolRedis)
}

// 获取 多个货币对 redis 信息
export const getsymbolsPrice = async (list, sign, signal) => {
  return await getSymbolsInfo(list, sign, signal, symbolPrice)
}

// export const tabChangeDebounce = throttle(getSymbolsInfo, 1000, { 'maxWait': 1000 });
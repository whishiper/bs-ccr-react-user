import { stringify } from 'qs';
import { request, config } from 'utils'

const { api } = config

const {
  decrypt,
  login,
  batch_stop_profit,
  mqttConf,
  by_tel_get_User_info,
  bind_google_auth,
  verify_google_code,
  update_binding,
  login_code,
  search_coin_pairs,
  trade_platform,
  trade_platform_api,
  delete_api,
  api_list,
  api_detail,
  verify_api,
  coin_sort,
  trigger_currency_kline,
  hold_shares_list,
  coin_pairs_choice_by_is_start_list,
  get_coin_pairs_choice_detail,
  get_ip,
  activeCode,
  robot_list,
  bind_api,
  remove_api,
  coin_pair_choice,
  get_profit_list,
  get_profit_summary,
  get_buy_logs,
  get_buy_total,
  get_coin_pairs_choice_list,
  free_coin_pair,
  free_coin_pair_params,
  set_trade_params,
  strategy,
  one_click_settings,
  currency_info,
  symbol_info,
  register_code,
  user_register,
  is_add_choice,
  add_coin_pair_choice,
  start_trade,
  pause_trade,
  recover_buy,
  stop_profit_trade,
  cancel_stop_profit_trade,
  batch_pause_trade,
  batch_recover_buy,
  batch_stop_profit_trade,
  batch_cancel_stop_profit_trade,
  batch_sell_all_orders,
  forget_orders,
  sell_all_orders,
  update_password,
  reset_password_code,
  update_tel,
  reset_tel_code,
  forget_password,
  old_tel_validate_code,
  order_group_detail,
  search_order_group,
  get_trade_overview,
  huobi_market_detail_merged,
  huobi_market_tickers,
} = api



/* --------------------------登陆------------------------- */

// 用户登录
export function userLogin(params) {
  return request(login, {
    method: 'post',
    data: params,
  })
}

// 批量停止设置了止盈后停止的货币对，登陆时触发即可
export function batchStopProfit(params) {
  return request(batch_stop_profit, {
    method: 'post',
    data: params,
  })
}

/* --------------------------忘记密码------------------------- */

// 忘记密码
export function forgetPassword(params) {
  return request(forget_password, {
    method: 'put',
    data: params,
  })
}

/* --------------------------注册------------------------- */

// 用户注册
export async function Register_code(params) {
  return request(register_code, {
    method: 'post',
    data: params,
  });
}
export async function userRegister(params) {
  return request(user_register, {
    method: 'post',
    data: params,
  });
}

// 获取用户信息
export async function byTelGetUserInfo(params) {
  return request(`${by_tel_get_User_info}?${stringify(params)}`);
}

// 验证码
export function loginCode(params) {
  return request(login_code, {
    method: 'post',
    data: params,
  })
}

/* --------------------------账号设置------------------------- */
//更改手机号码
export async function updateTel(params) {
  return request(update_tel, {
    method: 'put',
    data: params,
  });
}
// 验证手机
export async function verifyTelCode(params) {
  return request(reset_tel_code, {
    method: 'POST',
    data: params,
  });
}

export async function oldTelValidateCode(params) {
  return request(old_tel_validate_code, {
    method: 'POST',
    data: params,
  })
}
//修改密码
export async function updatePassword(params) {
  return request(update_password, {
    method: 'put',
    data: params,
  });
}
// 验证密码
export async function verifyPasswordCode(params) {
  return request(reset_password_code, {
    method: 'POST',
    data: params,
  });
}

// 谷歌 二维码
export async function bindGoogleAuth(params) {
  return request(bind_google_auth, {
    method: 'POST',
    data: params,
  });
}

// 验证谷歌
export async function verifyGoogleCode(params) {
  return request(verify_google_code, {
    method: 'POST',
    data: params,
  });
}

// 用户绑定谷歌验证
export async function userBindGoogle(params) {
  return request(`${update_binding}?${stringify(params)}`, {
    method: 'put',
  });
}

/* --------------------------API管理页面------------------------- */

// 加密api
export async function decryptAPI(params) {
  return request(decrypt, {
    method: 'post',
    data: params,
  });
}

// 获取 api 列表
export async function getApiList(params) {
  return request(`${api_list}?${stringify(params)}`);
}

// 获取 交易平台列表
export async function getTradePlatformList(params) {
  return request(`${trade_platform}?${stringify(params)}`);
}

// 添加 api
export async function addApi(params) {
  return request(verify_api, {
    method: 'post',
    data: params,
  });
}

// 获取 api 详情
export async function getApiDetail(params) {
  return request(`${api_detail}${params}`);
}

// 编辑 api
export async function editApi(params) {
  return request(verify_api, {
    method: 'post',
    data: params,
  });
}

// 删除 api 
export async function deleteApi(params) {
  return request(delete_api, {
    method: 'post',
    data: params,
  });
}


/* --------------------------CCR智能交易机器人页面------------------------- */

// 激活码
export async function handleActiveCode(params) {
  return request(`${activeCode}?${stringify(params)}`, {
    method: 'post',
  });
}

// CCR智能交易机器人列表
export async function getRobotList(params) {
  return request(`${robot_list}?${stringify(params)}`);
}

// 获取ip
export async function getIp(params) {
  return request(`${get_ip}?${stringify(params)}`);
}

// 绑定api
export async function bindApi(param) {
  return request(bind_api, {
    method: 'post',
    data: param
  });
}

// 解除 api 绑定
export async function unbinddApi(params) {
  return request(`${remove_api}`, {
    method: 'post',
    data:params
  });
}

/* --------------------------收益总结和买入日志公共------------------------- */

// 获取收益总结或买入日志自选币自选币
export function getCoinPairChoiceChoiceList(params) {
  return request(`${coin_pair_choice}?${stringify(params)}`)
}

// 获取收益总结列表
export function getProfitList(params) {
  return request(`${get_profit_list}?${stringify(params)}`)
}

// 获取收益总结
export function getProfitSummary(params) {
  return request(`${get_profit_summary}?${stringify(params)}`)
}


// 获取买入日志列表

export function getBuyLogs(params) {
  return request(`${get_buy_logs}?${stringify(params)}`)
}

// 买入总结
export function getBuyTotal(params) {
  return request(`${get_buy_total}?${stringify(params)}`)
}

/* --------------------------交易管理页面------------------------- */

// 获取 mqttConf 配置信息
export function getMqttConf() {
  return request(mqttConf)
}

// 交易平台信息
export function getTradePatformApi(params) {
  return request(`${trade_platform_api}${params}`)
}

// 计价货币排序列表
export function coinSort(params) {
  return request(`${coin_sort}/?${stringify(params)}`)
}

// 触发K线
export function triggerCurrencyKline(params) {
  return request(`${trigger_currency_kline}?${stringify(params)}`)
}

// 获取货币最新报价信息
export function huobiMarketDetailMerged(params) {
  return request(`${huobi_market_detail_merged}?${stringify(params)}`)
}


// 获取自选货币对
export function getFreeCoinPair(params) {
  return request(`${free_coin_pair}?${stringify(params)}`)
}

// 获取自选币列表
export function getCoinPairsChoiceList(params) {
  return request(`${get_coin_pairs_choice_list}?${stringify(params)}`)
}

// 获取计价货币交易信息(总持仓费用，总预算，交易货币对数量,资产等）
export function getCurrencyInfo(params) {
  return request(currency_info, {
    method: 'post',
    data: params,
  })
}


// 自选货币对交易信息(持仓费用，持仓均价，预算 etc)
export function getSymbol_info(params) {
  const {signal, ...param} = params
  return request(symbol_info, {
    method: 'get',
    signal,
    params:param
  })
}

// 获取交易参数
export function getFreeCoinPairParams(params) {
  return request(`${free_coin_pair_params}/${params}`)
}

// 设置交易参数
export function setTradeParams(params) {
  return request(set_trade_params, {
    method: 'post',
    data: params,
  })
}

// 删除自选货币对
export function deletelFreeCoinPair(params) {
  return request(`${free_coin_pair}`, {
    method: 'post',
    data: params,
  })
}

// 开始策略 
export function startTrade(params) {
  return request(start_trade, {
    method: 'post',
    data: params,
  })
}

// 暂停买入
export function pauseTrade(params) {
  return request(pause_trade, {
    method: 'post',
    data: params,
  })
}

// 恢复买入
export function recoverBuy(params) {
  return request(recover_buy, {
    method: 'post',
    data: params,
  })
}

// 设置止盈后停止
export function stopProfitTrade(params) {
  return request(stop_profit_trade, {
    method: 'post',
    data: params,
  })
}

// 取消止盈停止
export function cancelStopProfitTrade(params) {
  return request(cancel_stop_profit_trade, {
    method: 'post',
    data: params,
  })
}


// 立即停止 忘记订单
export function forgetOrders(params) {
  return request(forget_orders, {
    method: 'post',
    data: params,
  })
}

// 立即停止 清仓卖出
export function sellAllOrders(params) {
  return request(sell_all_orders, {
    method: 'post',
    data: params,
  })
}

// 批量暂停买入
export function batchPauseTrade(params) {
  return request(batch_pause_trade, {
    method: 'post',
    data: params,
  })
}

// 批量
export function batchRecoverBuy(params) {
  return request(batch_recover_buy, {
    method: 'post',
    data: params,
  })
}

// 批量止盈后停止
export function batchStopProfitTrade(params) {
  return request(batch_stop_profit_trade, {
    method: 'post',
    data: params,
  })
}

// 批量取消止盈后停止
export function batchCancelStopProfitTrade(params) {
  return request(batch_cancel_stop_profit_trade, {
    method: 'post',
    data: params,
  })
}

// 批量立即停止 清仓卖出
export function batchSellAllOrders(params) {
  return request(batch_sell_all_orders, {
    method: 'post',
    data: params,
  })
}

/* --------------------------交易详情页面------------------------- */
// 自选币详情
export function getCoinPairsChoiceDetail(params) {
  return request(`${get_coin_pairs_choice_detail}${params}`)
}

// 获取持仓列表
export function getHoldSharesList(params) {
  return request(`${hold_shares_list}?${stringify(params)}`)
}


/* --------------------------交易记录页面------------------------- */

// 筛选交易组列表
export function searchOrderGroup(params) {
  return request(`${search_order_group}?${stringify(params)}`)
}

// 获取交易组详情
export function orderGroupDetail(params) {
  return request(`${order_group_detail}${params}`)
}

// 获取总预览
export function getTradeOverview(params) {
  return request(`${get_trade_overview}?${stringify(params)}`)
}


/* --------------------------一键设置页面------------------------- */

// 获取未开始策略的自选货币对
export function coinPairsChoiceByIsStartList(params) {
  return request(`${coin_pairs_choice_by_is_start_list}?${stringify(params)}`)
}

// 获取策略列表
export function getStrategyList(params) {
  return request(`${strategy}?pageNum=1&pageSize=10`)
}

// 策略说明
export function getStrategyExplain(params) {
  return request(`${strategy}${params}`)
}

// 一键设置预算 应用
export function oneClickSetBudget(params) {
  return request(one_click_settings, {
    method: 'post',
    data: params,
  })
}

/* --------------------------添加货币对页面------------------------- */

// 搜索自选货币对
export function searchCoinPairs(params) {
  return request(search_coin_pairs, {
    method: 'post',
    data: params,
  })
}

// 检测是否添加自选
export function isAddChoice(params) {
  return request(`${is_add_choice}?${stringify(params)}`)
}

// 获取所有的货币最新报价信息
export function huobiMarketTickers() {
  return request(`${huobi_market_tickers}`)
}

// 添加自选货币
export function addAoinPairChoice(params) {
  return request(add_coin_pair_choice, {
    method: 'post',
    data: params,
  })
}
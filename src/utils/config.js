let url = '';
let mqttConf = '';
const NODE_ENV = process.env.NODE_ENV
const NODE_TEST = process.env.NODE_TEST
const huobi = 'http://47.240.254.214:8000'
const okex = 'https://www.okex.me/api/futures/v3'

console.log(NODE_ENV, '--NODE_ENV')
console.log(NODE_TEST, '--NODE_TEST')

// 本地启动
if (NODE_TEST === 'test_start' && NODE_ENV === 'development') {
  // 测试环境
  url = 'http://node-ccr-server.bosenkeji.cn';
  mqttConf = url + '/mqttConf'
}

if (NODE_TEST === 'dev' && NODE_ENV === 'development') {

  // 线上环境
  url = 'http://ccr-control.bosenkeji.cn';
  mqttConf = url + '/mqttConf?env=prod'
}

// 打包上线

if (NODE_TEST === 'test_start' && NODE_ENV === 'production') {
  // 测试环境
  url = 'http://node-ccr-server.bosenkeji.cn';
  mqttConf = url + '/mqttConf'
}

if (NODE_TEST === 'dev' && NODE_ENV === 'production') {
  // 线上环境
  url = 'http://ccr-control.bosenkeji.cn';
  mqttConf = url + '/mqttConf?env=prod'
}

module.exports = {
  name: '链信管理平台',
  prefix: 'lxAdmin',
  footerText: 'LianXin  © 2018',
  logo: '/public/logo.svg',
  iconFontCSS: '/public/iconfont.css',
  iconFontJS: '/public/iconfont.js',
  CORS: [url],
  openPages: ['/login'],
  apiPrefix: '/api',
  api: {
    decrypt: `${url}/decrypt`,
    token: `${url}/token`,
    login: `${url}/login`,
    batch_stop_profit: `${url}/batchStopProfit`,// 批量停止设置了止盈后停止的货币对，登陆时触发即可
    mqttConf,
    by_tel_get_User_info: `${url}/user/get_by_tel`,
    login_code: `${url}/login_code`,
    bind_google_auth: `${url}/bindGoogleAuth`,
    verify_google_code: `${url}/verifyCode`,
    update_binding: `${url}/user/update_binding`,
    trade_platform: `${url}/trade_platform/`,
    trade_platform_api: `${url}/trade_platform_api/`,
    delete_api:`${url}/delete_api`,
    api_list: `${url}/api_list`,
    api_detail: `${url}/api_detail/`,
    verify_api: `${url}/verify_api`,
    search_coin_pairs: `${url}/search/coin/pairs`,
    get_ip: `${url}/getIp`,
    activeCode: `${url}/cd_key/activation`,
    robot_list: `${url}/trade_platform_api_bind_product_combo/by_user_id`,
    bind_api: `${url}/bind_api`,
    remove_api:`${url}/remove_api`,
    coin_sort: `${url}/coin_sort`,
    trigger_currency_kline: `${url}/trigger_currency_kline`,
    hold_shares_list: `${url}/coin_pair_choice/position_details`,
    get_coin_pairs_choice_list: `${url}/coin_pair_choice/`,
    // batch_stop_profit_trade: `${url}/`,
    coin_pairs_choice_by_is_start_list:`${url}/coin_pair_choice/by_is_start`,
    get_coin_pairs_choice_detail: `${url}/coin_pair_choice/`,
    free_coin_pair: `${url}/delSymbol`,
    free_coin_pair_params: `${url}/coin_pair_choice_attribute_custom`,
    set_trade_params: `${url}/setTradeParams`,
    strategy: `${url}/strategy/`,
    one_click_settings: `${url}/setting/`,
    coin_pair_choice_attribute: `${url}/coin_pair_choice_attribute/`,
    currency_info: `${url}/currencyInfo`,
    symbol_info: `${url}/symbolInfo`,
    register_code: `${url}/register_code`,
    user_register: `${url}/user_register`,
    is_add_choice: `${url}/coin_pair_choice/check_coin_pair_choice`,
    add_coin_pair_choice: `${url}/addSymbol`,
    start_trade: `${url}/start_trade`,
    pause_trade: `${url}/pause_trade`,
    recover_buy: `${url}/recover_buy`,
    stop_profit_trade: `${url}/stop_profit_trade`,
    cancel_stop_profit_trade: `${url}/cancel_stop_profit_trade`,
    batch_pause_trade: `${url}/batch_pause_trade`,
    batch_recover_buy: `${url}/batch_recover_buy`,
    batch_stop_profit_trade: `${url}/batch_stop_profit_trade`,
    batch_cancel_stop_profit_trade: `${url}/batch_cancel_stop_profit_trade`,
    batch_sell_all_orders: `${url}/batch_sell_all_orders`,
    forget_orders: `${url}/forget_orders`,
    sell_all_orders: `${url}/sell_all_orders`,
    update_password: `${url}/api/update_password`,
    reset_password_code: `${url}/reset_password_code`,
    update_tel: `${url}/api/update_tel`,
    reset_tel_code: `${url}/reset_tel_code`,
    forget_password: `${url}/api/forget_password`,
    old_tel_validate_code: `${url}/api/old_tel/validate/code`,
    coin_pair_choice: `${url}/coin_pair_choice/record`,
    get_profit_list: `${url}/trade_order/by_condition_for_shell_profit`,
    get_profit_summary: `${url}/trade_order/total_shell_profit_by_condition`,
    get_buy_logs: `${url}/trade_order/by_condition_for_buy_logs`,
    get_buy_total: `${url}/trade_order/total_trade_cost_by_condition`,
    order_group_detail: `${url}/order_group/`,
    search_order_group: `${url}/order_group/search_group`,
    get_trade_overview: `${url}/order_group/trade_overview`,
    huobi_market_detail_merged:`${huobi}/market/detail/merged`,
    huobi_market_tickers:`${huobi}/market/tickers`,
    okex_market_tickers:`${okex}/instruments/ticker`,
  },
}

import React from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import App from './App'
import {
  Login,
  Register,
  Forget,
  NoAuth,
  NotFound,
  Deal,
  CoinPairsAdd,
  CoinPairsDetails,
  BudgetSetting,
  ProfitSummary,
  BuyLogs,
  TradeHistory,
} from 'views'

import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('en');


function RouterConfig({ history }) {
  return (
    <ConfigProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />
          <Route path="/forget" exact component={Forget} />
          <Route path="/noauth" exact component={NoAuth} />
          <Route path="/ccr/profit/summary/:robotId/:robotBindApiId/:tradePlatformId/:tradePatformApiId/"  component={ProfitSummary} />
          <Route path="/ccr/buy/logs/:robotId/:robotBindApiId/:tradePlatformId/:tradePatformApiId/"  component={BuyLogs} />
          <Route path="/ccr/add_coin_apirs/:robotBindApiId/:coinId/:coinName" exact component={CoinPairsAdd} />
          <Route path="/ccr/deal/:robotId/:robotBindApiId/:tradePlatformId/:tradePatformApiId/coin_pair_choice_list" component={Deal} />
          <Route path="/ccr/coin/budget/setting/:robotId/:robotBindApiId/:tradePlatformId/:tradePatformApiId/:coinId/:coinName" exact component={BudgetSetting} />
          <Route path="/ccr/coin/details/:id/:signId/:tradePatformApiId" exact component={CoinPairsDetails} />
          <Route path="/ccr/coin/trade/history/:id" exact component={TradeHistory} />
          <Route path="/ccr" component={App} />
          <Route path="/404" exact component={NotFound} />
          <Redirect to="/ccr" from="/" exact />
          <Redirect to="/404" />
        </Switch>
      </Router>
    </ConfigProvider>
  );
}

export default RouterConfig
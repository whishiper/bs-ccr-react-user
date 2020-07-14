import React from 'react';
import { Link, routerRedux } from 'dva/router';
import { Row, Col, Affix, Empty, Spin, Icon, Button, Menu, Modal } from 'antd';
import { coin_base_two_num } from 'utils';
import { is_start_trade } from 'utils/handlerResults';
import StartTradeCard from './StartTradeCard';
import NotStartTradeCard from './NotStartTradeCard';

import style from '../index.less';


const NewTabPane = ({
  dealAdmin,
  match,
  dispatch,
}) => {
  const {
    freeCoinPairList = [],
    activeTabsKey,
    activeItem,
    tradePatformApi,
    isShowCurrencyInfo,
    currencyLoading,
    currencyInfo,
    loading,
    coinLoading
  } = dealAdmin;

  const { sign } = tradePatformApi;

  const { params } = match;
  const {
    tradePatformApiId,
    robotBindApiId,
    robotId,
    tradePlatformId
  } = params;

  const {
    position_cost_total,
    budget_total,
    trading_symbol_num,
    balance
  } = currencyInfo;


  const cancelStopProfitTrade = value => {
    Modal.confirm({
      title: `取消止盈后停止 - ${value.coinPair ? value.coinPair.name : ''}`,
      content: '您是否确定取消止盈后停止？',
      okText: '确认',
      cancelText: '我再想想',
      onOk: () => {
        dispatch({ type: 'dealAdmin/cancelStopProfitTrade', payload: value });
      }
    });
  };

  const forgetOrders = value => {
    Modal.confirm({
      title: `忘记订单 - ${value.coinPair ? value.coinPair.name : ''}`,
      content:
        '使用后，会让机器人忘记本轮订单并停止策略，确定忘记订单？',
      okText: '确认',
      cancelText: '我再想想',
      onOk: () => {
        dispatch({ type: 'dealAdmin/forgetOrders', payload: value });
      }
    });
  };

  const sellAllOrders = value => {
    Modal.confirm({
      title: `立即清仓 - ${value.coinPair ? value.coinPair.name : ''}`,
      content:
        '使用后，会把货币对的持仓数量（资产数量不足时将卖出剩余全部）以现价卖出，卖出成功将会停止策略，卖出失败则继续持有，确定清仓？',
      okText: '确认',
      cancelText: '我再想想',
      onOk: () => {
        dispatch({ type: 'dealAdmin/sellAllOrders', payload: value });
      }
    });
  };

  const deletelFreeCoinPair = value => {
    Modal.confirm({
      title: `删除 - ${value.coinPair ? value.coinPair.name : ''}`,
      content: '您确定删除该自选币？',
      okText: '确认',
      cancelText: '我再想想',
      icon: null,
      onOk: () => {
        dispatch({ type: 'dealAdmin/deletelFreeCoinPair', payload: value });
      }
    });
  };
  const stopProfitTrade = value => {
    Modal.confirm({
      title: `止盈后停止 - ${value.coinPair ? value.coinPair.name : ''}`,
      content:
        '使用后，会在本轮策略盈利结束后停止策略，如需重新交易，请点击开始策略。您是否确定止盈后停止？',
      okText: '确认',
      cancelText: '我再想想',
      onOk: () => {
        dispatch({ type: 'dealAdmin/stopProfitTrade', payload: value });
      }
    });
  };

  const setDealParamsModalShow = values => {
    dispatch({
      type: 'dealAdmin/setDealParamsModalShow',
      payload: values
    });
  };

  const setBudgetModalShow = () => {
    dispatch({
      type: 'dealAdmin/updateState',
      payload: {
        setBudgetModalVisible: true
      }
    });
  };
  const goToBudgetSet = () => {
    const { coin: { id, name } } = activeItem || {}
    dispatch(
      routerRedux.push(
        `/ccr/coin/budget/setting/${robotId}/${robotBindApiId}/${tradePlatformId}/${tradePatformApiId}/${id}/${name}`
      )
    );
  };

  const pauseTrade = value => {
    Modal.confirm({
      title: `暂停买入 - ${value.coinPair ? value.coinPair.name : ''}`,
      content: '您是否确定暂停买入？',
      okText: '确认',
      cancelText: '我再想想',
      icon: null,
      onOk: () => {
        dispatch({ type: 'dealAdmin/pauseTrade', payload: value });
      }
    });
  };

  const recoverBuy = value => {
    Modal.confirm({
      title: `恢复买入 - ${value.coinPair ? value.coinPair.name : ''}`,
      content: '您是否确定恢复买入？',
      okText: '确认',
      cancelText: '我再想想',
      icon: null,
      onOk: () => {
        dispatch({ type: 'dealAdmin/recoverBuy', payload: value });
      }
    });
  };
  const startTrade = value => {
    Modal.confirm({
      title: `开始策略 - ${value.coinPair ? value.coinPair.name : ''}`,
      content: '您是否确定开启策略？',
      okText: '确认',
      cancelText: '我再想想',
      icon: null,
      onOk: () => {
        dispatch({ type: 'dealAdmin/startTrade', payload: value });
      }
    });
  };

  const menu = value => {
    return (
      <Menu>
        <Menu.Item>
          {typeof value === 'object' &&
            (Reflect.has(value, 'is_set_stop_profit_trade') &&
              Number(value.is_set_stop_profit_trade) === 1) ? (
              <a onClick={() => { cancelStopProfitTrade(value) }}> 取消止盈后停止</a>
            ) : (
              <a onClick={() => { stopProfitTrade(value) }} > 止盈后停止</a>
            )}
        </Menu.Item>
        <Menu.Item>
          <a onClick={() => { forgetOrders(value) }}>立即停止[忘记订单]</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={() => { sellAllOrders(value) }}>立即停止[清仓卖出]</a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <a onClick={() => { setDealParamsModalShow(value) }}>交易参数设置</a>
        </Menu.Item>
      </Menu>
    );
  };

  const menu2 = value => {
    return (
      <Menu>
        <Menu.Item>
          <a onClick={setBudgetModalShow}>设置预算</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={() => { deletelFreeCoinPair(value) }} > 删除自选</a>
        </Menu.Item>
      </Menu>
    );
  };

  return (
    <>
      <Affix offsetTop={110} style={{ background: '#fff' }}>
        <Spin tip="Loading..." spinning={currencyLoading} delay="120">
          <Row
            type="flex"
            justify="space-around"
            align="middle"
            className={style.top}
          >
            <Col md={12} lg={6} className={style.assets_info}>
              <span>
                资产总数：
                  {balance && Reflect.has(balance, 'balance')
                  ? coin_base_two_num(balance.balance, activeItem)
                  : 0}
              </span>
            </Col>
            <Col md={12} lg={6} className={style.assets_info}>
              总持仓费用：
                {coin_base_two_num(position_cost_total, activeItem) || 0}
            </Col>
            <Col md={12} lg={6} className={style.assets_info} >
              交易中总预算：
                {coin_base_two_num(budget_total, activeItem) || 0}
            </Col>
            <Col md={12} lg={6} className={style.assets_info} >
              交易货币对数量：{trading_symbol_num || 0} 个
              </Col>
            {!isShowCurrencyInfo ? (
              <div className={style.assets_but}>
                <a onClick={() => this.getCurrencyInfo()}>
                  <Icon type="loading" style={{ fontSize: 12 }} spin />{' '}
                  重新获取资产
                  </a>
              </div>
            ) : (
                ''
              )}
          </Row>
        </Spin>
      </Affix>
      <Affix offsetTop={164} style={{ background: '#fff' }}>
        <Row
          type="flex"
          justify="space-between"
          align="middle"
          className={style.but}
          style={{ background: '#fff' }}
        >
          <Col>自选货币对</Col>
          <Col>

            <Button type="link" disabled={loading}  >
              <Link to={`/ccr/add_coin_apirs/${robotBindApiId}/${activeTabsKey}/${activeItem.coin ? activeItem.coin.name : ''}`}>
                添加货币对
              </Link>
            </Button>
            <Button type="link" disabled={loading} onClick={() => goToBudgetSet()} > 一键设置预算</Button>
            {/* <a onClick={handleBatchHandleModalShow}>批量操作</a> */}
          </Col>
        </Row>
      </Affix>
      <Spin tip="Loading..." spinning={coinLoading} delay="120">
        <div
          className={
            JSON.stringify(freeCoinPairList) !== '[]'
              ? style.list
              : style.list_empty
          }
        >
          {JSON.stringify(freeCoinPairList) !== '[]' ? (
            freeCoinPairList.map(item => {
              return (
                <div className={style.list_item} key={item.id}>
                  { !is_start_trade( item.trade_status) ? (
                    <StartTradeCard
                      menu={menu(item)}
                      freeCoinPairItem={item}
                      pauseTrade={pauseTrade}
                      recoverBuy={recoverBuy}
                      stopProfitTrade={stopProfitTrade}
                      dispatch={dispatch}
                      activeItem={activeItem}
                      tradePatformApiId={tradePatformApiId}
                      sign={sign}
                    />
                  ) : (
                      <NotStartTradeCard
                        menu2={menu2(item)}
                        freeCoinPairItem={item}
                        startTrade={startTrade}
                        stopProfitTrade={stopProfitTrade}
                        dispatch={dispatch}
                        activeItem={activeItem}
                        sign={sign}
                        tradePatformApiId={tradePatformApiId}
                      />
                    )}
                </div>
              );
            })
          ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无数据，请添加货币对"
              />
            )}
        </div>
      </Spin>
    </>
  );
};

export default NewTabPane;

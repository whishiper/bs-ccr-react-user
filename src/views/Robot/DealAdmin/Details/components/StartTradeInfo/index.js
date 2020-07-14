import React, { Component } from 'react'
import { Row, Col, Icon, Button, Menu, Dropdown, Popover, Tooltip, Modal } from 'antd';
import style from './index.less';
import { routerRedux } from "dva/router";
import { coin_base_four_num, coin_base_two_num } from 'utils';
import {
  is_start_trade,
  is_stop_buy,
  is_resume_buy,
  is_monitor_buy,
  is_stop_profit_stop,
  is_insufficient_transaction_currency,
  realTimeEarningRatio,
  real_time_earning_ratio_color
} from 'utils/handlerResults'

import cost_icon from 'assets/cost_icon.png'
import trade_icon from 'assets/trade_icon.png'
import stop_buy_icon from 'assets/stop_buy_icon.png'
import stop_profit_stop_icon from 'assets/stop_profit_stop_icon.png'
import insufficient_transaction_currency from 'assets/insufficient_transaction_currency.png'


export default class StartTradeInfo extends Component {
  render() {

    const { match, coinPairChoice, dispatch } = this.props
    const { params } = match
    const { id } = params

    const {
      finished_order,
      position_num = '0', // 持仓数量
      position_average = '0', //均价
      position_cost = '0', // 持仓费
      real_time_earning_ratio, // 实时收益率
      node_calc_real_time_earning_ratio = 0,
      openPrice,
      is_set_stop_profit_trade,
      isStart,
      trade_status,
      budget,
      lastBuildPrice,
      isTradeError = 0,
      tradeErrorMsg = '',
      coinPair = {}
    } = coinPairChoice

    let symbol_balance = JSON.parse(sessionStorage.getItem('symbol_balance'))
    let activeItem = JSON.parse(sessionStorage.getItem('activeItem')) || {}

    const { name } = coinPair
    const menu = (
      <Menu>
        <Menu.Item>
          <a onClick={() => { setDealParamsModalShow(coinPairChoice) }}>交易参数设置</a>
        </Menu.Item>
      </Menu>
    );

    const stopStrategyMenu = () => {
      return <Menu>
        <Menu.Item>
          {Number(is_set_stop_profit_trade) === 1
            ?
            <a onClick={() => { cancelStopProfitTrade(coinPairChoice) }}>取消止盈后停止</a>
            :
            <a onClick={() => { stopProfitTrade(coinPairChoice) }}>止盈后停止</a>
          }

        </Menu.Item>
        <Menu.Item>
          <a onClick={() => { forgetOrders(coinPairChoice) }}>立即停止[忘记订单]</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={() => { sellAllOrders(coinPairChoice) }}>立即停止[清仓卖出]</a>
        </Menu.Item>
        {/* <Menu.Divider /> */}
      </Menu>
    };

    const pauseTrade = () => {

      Modal.confirm({
        title: `暂停买入 - ${coinPairChoice.coinPair ? coinPairChoice.coinPair.name : ''}`,
        content: '您是否确定暂停买入？',
        okText: '确认',
        cancelText: '我再想想',
        icon: null,
        onOk: () => {
          dispatch({ type: 'coinPairsDetails/pauseTrade', payload: coinPairChoice })
        }
      });
    }

    const recoverBuy = () => {

      Modal.confirm({
        title: `恢复买入 - ${coinPairChoice.coinPair ? coinPairChoice.coinPair.name : ''}`,
        content: '您是否确定恢复买入？',
        okText: '确认',
        cancelText: '我再想想',
        icon: null,
        onOk: () => {
          dispatch({ type: 'coinPairsDetails/recoverBuy', payload: coinPairChoice })
        }
      });
    }

    const stopProfitTrade = () => {
      Modal.confirm({
        title: `止盈后停止 - ${coinPairChoice.coinPair ? coinPairChoice.coinPair.name : ''}`,
        content: '使用后，会在本轮策略盈利结束后停止策略，如需重新交易，请点击开始策略。您是否确定止盈后停止？',
        okText: '确认',
        cancelText: '我再想想',
        onOk: () => {
          dispatch({ type: 'coinPairsDetails/stopProfitTrade', payload: coinPairChoice })
        }
      });
    }

    const cancelStopProfitTrade = () => {
      Modal.confirm({
        title: `取消止盈后停止 - ${coinPairChoice.coinPair ? coinPairChoice.coinPair.name : ''}`,
        content: '您是否确定取消止盈后停止？',
        okText: '确认',
        cancelText: '我再想想',
        onOk: () => {
          dispatch({ type: 'coinPairsDetails/cancelStopProfitTrade', payload: coinPairChoice })
        }
      });
    }

    const forgetOrders = () => {
      Modal.confirm({
        title: `忘记订单 - ${coinPairChoice.coinPair ? coinPairChoice.coinPair.name : ''}`,
        content: '使用后，会让机器人忘记本轮订单并停止策略，确定忘记订单？',
        okText: '确认',
        cancelText: '我再想想',
        onOk: () => {
          dispatch({ type: 'coinPairsDetails/forgetOrders', payload: coinPairChoice })
        },
      });
    }

    const sellAllOrders = () => {
      Modal.confirm({
        title: `立即清仓 - ${coinPairChoice.coinPair ? coinPairChoice.coinPair.name : ''}`,
        content: '使用后，会把货币对的持仓数量（资产数量不足时将卖出剩余全部）以现价卖出，卖出成功将会停止策略，卖出失败则继续持有，确定清仓？',
        okText: '确认',
        cancelText: '我再想想',
        onOk: () => {
          dispatch({ type: 'coinPairsDetails/sellAllOrders', payload: coinPairChoice })
        }
      });
    }

    const setDealParamsModalShow = () => {
      dispatch({
        type: 'coinPairsDetails/setDealParamsModalShow',
        payload: coinPairChoice
      })
    }

    const goToTradeHistory = () => {
      let symbol = {
        quote_currency: coinPairChoice.quote_currency,
        base_currency: coinPairChoice.symbol.split('-')[0]
      }
      sessionStorage.setItem('symbol', JSON.stringify(symbol))
      dispatch(routerRedux.push(`/ccr/coin/trade/history/${id}`));
    }

    return (
      <div className={style.warpper}>
        <div className={style.top}>

          <div className={style.title}>
            <span>{name ? name.toUpperCase() : '---'}</span>
          </div>

          <Row type='flex' justify='space-between' align='middle'>
            <Col span={8}>
              <Row type='flex' justify='space-between' align='middle'>

                <Col span={8} style={{ color: 'red', fontWeight: 'bold' }}>{openPrice || 0}</Col>

                <Col className={style.status} span={16} >
                  <Tooltip placement="rightTop" title={'收益比'}>
                    <span
                      className={style.earnings_ratio}
                      style={{
                        fontWeight: 'bold',
                        color: real_time_earning_ratio_color({ real_time_earning_ratio, node_calc_real_time_earning_ratio }),
                        display: !is_start_trade(trade_status) ? 'block' : 'none'
                      }}
                    >
                      {
                        realTimeEarningRatio({
                          finished_order,
                          real_time_earning_ratio,
                          node_calc_real_time_earning_ratio
                        })
                      }
                    </span>
                  </Tooltip>

                  <Tooltip placement="rightTop" title={'暂停买入'} >
                    <img src={stop_buy_icon} alt='' style={{ display: is_stop_buy(trade_status) }} className={style.card_item_icon} />
                  </Tooltip>

                  <Tooltip placement="rightTop" title={'监控买入'}>
                    <img src={trade_icon} alt='' style={{ display: is_monitor_buy(trade_status, is_set_stop_profit_trade) }} className={style.card_item_icon} />
                  </Tooltip>

                  <Tooltip placement="rightTop" title={'止盈后停止'}>
                    <img src={stop_profit_stop_icon} alt='' style={{ display: is_stop_profit_stop(is_set_stop_profit_trade) }} className={style.card_item_icon} />
                  </Tooltip>

                  <Tooltip placement="rightTop" title={tradeErrorMsg || null} >
                    <Icon type="warning" style={{
                      fontSize: '15px', margin: '0 5px', color: '#ffac38',
                      display: Number(isTradeError) === 1 && tradeErrorMsg ? 'block' : 'none'
                    }} />
                  </Tooltip>

                </Col>
              </Row>
            </Col>

            <Col span={15}>
              <Row type='flex' justify='end' align='middle'>

                {
                  is_resume_buy(trade_status)
                    ? <Button style={{ marginRight: '15px' }} onClick={() => { recoverBuy() }}>恢复买入</Button>
                    : <Button style={{ marginRight: '15px' }} onClick={() => { pauseTrade() }}>暂停买入</Button>
                }

                <Dropdown overlay={stopStrategyMenu} trigger={['click']}>
                  <Button style={{ marginRight: '15px' }}>停止策略 <Icon type="down" /></Button>
                </Dropdown>
                <Dropdown overlay={menu} trigger={['click']}>
                  <Button style={{ marginRight: '15px' }}>设置 <Icon type="down" /></Button>
                </Dropdown>
                <Button onClick={() => goToTradeHistory()}>交易记录</Button>
              </Row>
            </Col>

          </Row>
        </div>

        <div className={style.bot}>

          <Row type='flex' align='middle' justify='space-between' style={{ padding: '15px 10%' }}>
            <Col span={6}>
              <div className={style.top_row_title}>持仓费用</div>
              <div>
                <span>{position_cost && Number(position_cost) !== 0 ? coin_base_two_num(position_cost, activeItem) : 0}</span>
                <Popover
                  content={`预算:${budget && budget !== '0' ? coin_base_two_num(budget, activeItem) : 0} ${activeItem.coin.name.toUpperCase()}`}
                  trigger="hover"
                >
                  <img src={cost_icon} alt='' style={{ marginLeft: '20px', width: '20px' }} />
                </Popover>
              </div>
            </Col>
            <Col span={6}>
              <div className={style.top_row_title}>持仓均价</div>
              <div>{position_average && Number(position_average) !== 0 ? coin_base_four_num(position_average, activeItem) : 0}</div>
            </Col>
            <Col span={6}>
              <div className={style.top_row_title}>持仓数量</div>
              <Row type='flex' justify='start' align='middle'>
                <span> {position_num && Number(position_num) !== 0 ? coin_base_four_num(position_num, activeItem) : 0}</span>
                <Tooltip placement="rightTop" title={'交易货币数量不足'}>
                  <img
                    src={insufficient_transaction_currency}
                    alt=''
                    style={{ display: is_insufficient_transaction_currency(trade_status, symbol_balance, position_num), marginLeft: '20px' }}
                    className={style.card_item_icon} />
                </Tooltip>
              </Row>
            </Col>
          </Row>

          <Row type='flex' align='middle' justify='space-between' style={{ padding: '15px 10%' }}>
            <Col span={6}>
              <div>
                <span className={style.top_row_title}>最后建仓价</span>
                <Popover content={'低于该价格不适建仓'} trigger="hover">
                  <Icon style={{ marginLeft: '10px' }} type="exclamation-circle" />
                </Popover>
              </div>
              <div>{lastBuildPrice ? coin_base_four_num(lastBuildPrice, activeItem) : '---'}</div>
            </Col>
            <Col span={6}>
              <div className={style.top_row_title}>网格单数</div>
              <div>即将到来</div>
            </Col>
            <Col span={6}>
              <div className={style.top_row_title}>网格盈利</div>
              <div>即将到来</div>
            </Col>
          </Row>

        </div>
      </div>
    )
  }
}

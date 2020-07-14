import React, { Component } from 'react';
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

import { Row, Col, Icon, Card, Dropdown, Tooltip, Button, Spin } from 'antd';
import { routerRedux } from "dva/router";

import trade_icon from 'assets/trade_icon.png'
import stop_buy_icon from 'assets/stop_buy_icon.png'
import stop_profit_stop_icon from 'assets/stop_profit_stop_icon.png'
import insufficient_transaction_currency from 'assets/insufficient_transaction_currency.png'

import style from './CoinCard.less';
import '../index.less'

class StartTradeCard extends Component {

  render() {
    const { props } = this;
    const { menu, activeItem, freeCoinPairItem, pauseTrade, recoverBuy, dispatch, sign, tradePatformApiId } = props;

    const {
      openPrice,
      coinPair,
      isStart,
      trade_status,
      position_num, // 持仓数量
      finished_order,  // 买入订单量
      max_trade_order, // 最大交易量
      budget, //  预算
      // coinPairChoiceAttribute,
      emit_ratio, // 追踪止盈触发比例
      node_calc_real_time_earning_ratio = 0, // node返回的 实时收益率
      real_time_earning_ratio, // 实时收益率
      // is_trigger_trace_stop_profit, //是否触发追踪止盈
      position_cost,
      position_average,
      symbol_balance,
      is_set_stop_profit_trade,
      id,
      isTradeError = 0,
      tradeErrorMsg = '',
      loading
    } = freeCoinPairItem;

    const findCoinPairsDetails = () => {
      sessionStorage.setItem('activeItem', JSON.stringify(activeItem))
      sessionStorage.setItem('symbol_balance', JSON.stringify(symbol_balance || {}))
      dispatch(routerRedux.push(`/ccr/coin/details/${id}/${sign}/${tradePatformApiId}`));
    }

    const actions = () => {
      let button = <Button
        style={{ fontSize: '12px', width: '100%',height:'50px',lineHeight:'50px'}}
        type='link'
        onClick={() => { pauseTrade(freeCoinPairItem) }}>暂停买入</Button>

      if (is_resume_buy(trade_status)) {
        button = <Button
          style={{ fontSize: '12px', width: '100%',height:'50px',lineHeight:'50px'}}
          type='link'
          onClick={() => { recoverBuy(freeCoinPairItem) }}> 恢复买入 </Button>
      }

      return [
        button,
        <Dropdown overlay={menu} placement="bottomCenter" trigger={['click']}>
          <Button style={{ fontSize: '12px', width: '100%',height:'50px',lineHeight:'50px'}} type='link' onClick={e => e.preventDefault()} >
            更多 <Icon type="down" />
          </Button>
        </Dropdown>,
        <Button style={{ fontSize: '12px', width: '100%',height:'50px',lineHeight:'50px'}} type='link' onClick={findCoinPairsDetails} >
          详情 <Icon type="double-right" />
        </Button>
      ]

    }

    return (
      <Spin tip="Loading..." spinning={loading} delay="120">
        <Card hoverable={true} actions={actions()} className='start_trade_card'>
          <Row type='flex' justify='space-between' align='middle'>

            <Col style={{ fontSize: '12px', fontWeight: 'bold' }} span={8}>
              {coinPair ? coinPair.name.toUpperCase() : ''}
            </Col>

            <Col span={8} className={style.list_item_top}>
              <Tooltip placement="rightTop" title={'暂停买入'} >
                <img src={stop_buy_icon} alt='' style={{ display: is_stop_buy(trade_status) }} className={style.card_item_icon} />
              </Tooltip>

              <Tooltip placement="rightTop" title={'监控买入'}>
                <img src={trade_icon} alt='' style={{ display: is_monitor_buy(trade_status, is_set_stop_profit_trade) }} className={style.card_item_icon} />
              </Tooltip>

              <Tooltip placement="rightTop" title={'止盈后停止'}>
                <img src={stop_profit_stop_icon} alt='' style={{ display: is_stop_profit_stop(is_set_stop_profit_trade) }} className={style.card_item_icon} />
              </Tooltip>

              <Tooltip placement="rightTop" title={'交易货币数量不足'}>

                <img src={insufficient_transaction_currency} alt='' style={{ display: is_insufficient_transaction_currency(trade_status, symbol_balance, position_num) }} className={style.card_item_icon} />
              </Tooltip>

              <Tooltip placement="rightTop" title={tradeErrorMsg || null} >
                <Icon type="warning" style={{
                  fontSize: '15px', margin: '0 5px', color: '#ffac38',
                  display: Number(isTradeError) === 1 && tradeErrorMsg ? 'block' : 'none'
                }} />
              </Tooltip>

            </Col>

            <Col span={8}>
              <span style={{ fontSize: '12px', float: "right" }}> {finished_order || 0}/{max_trade_order || 0}单 </span>
            </Col>

          </Row>

          <Row type='flex' justify='space-between' align='middle' style={{ height: '20px' }}>
            <Col style={{ color: 'red' }}>{openPrice || 0}</Col>
            <Tooltip placement="rightTop" title={'收益比'}>
              <span
                className={style.earnings_ratio}
                style={{
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
          </Row>

          <Row type='flex' justify='end' style={{ height: '20px' }}>

            <div
              className={style.income_ratio}
              style={{
                color: '#3f8600',
                display: finished_order && Number(finished_order) !== 0
                  && real_time_earning_ratio
                  && emit_ratio
                  && Number(real_time_earning_ratio) >= 1 + Number(emit_ratio)
                  ?
                  'block'
                  :
                  'none'
              }}
            >
              <span style={{ fontSize: '12px' }}>
                {
                  real_time_earning_ratio && emit_ratio
                    ?
                    (real_time_earning_ratio - (1 + Number(emit_ratio))).toFixed(4)
                    : 0
                }
              </span>
              <Icon type="arrow-up" style={{ fontSize: '16px', marginLeft: '3px' }} />
            </div>

          </Row>

          <Row type='flex' justify='space-between' align='middle'>
            <Col style={{ fontSize: '12px', textAlign: 'left' }} span={8}>
              {position_cost && position_cost !== '0' ? coin_base_two_num(position_cost, activeItem) : '---'} <br />持仓费用
            </Col>
            <Col style={{ fontSize: '12px', textAlign: 'center' }} span={8}>
              {position_average && position_average !== '0' ? coin_base_four_num(position_average, activeItem) : '---'}<br />持仓均价
             </Col>
            <Col style={{ fontSize: '12px', textAlign: 'right' }} span={8}>
              {budget && budget !== '0' ? coin_base_two_num(budget, activeItem) : '---'}<br />预算
             </Col>
          </Row>

        </Card>
      </Spin>
    );
  }
}

export default StartTradeCard;

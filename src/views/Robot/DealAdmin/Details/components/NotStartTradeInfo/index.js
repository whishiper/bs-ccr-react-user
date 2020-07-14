import React, { Component } from 'react'
import { Row, Col, Icon, Button, Menu, Dropdown, Popover, Tooltip, Modal } from 'antd';
import style from './index.less';
import { routerRedux } from "dva/router";
import { coin_base_two_num } from 'utils';
import cost_icon from 'assets/cost_icon.png'

import { is_insufficient_transaction_currency } from 'utils/handlerResults'

import not_trade_icon from 'assets/not_trade_icon.svg'

export default class NotStartTradeInfo extends Component {
  render() {

    const { match, coinPairChoice, dispatch } = this.props
    const { params } = match
    const { id } = params

    const {
      position_num = '0', // 持仓数量
      trade_status,
      budget,
      coinPair = {}
    } = coinPairChoice

    let symbol_balance = JSON.parse(sessionStorage.getItem('freeCoinPairItem'))
    let activeItem = JSON.parse(sessionStorage.getItem('activeItem'))
    let openPrice = sessionStorage.getItem('openPrice')


    const { name } = coinPair
    const menu = (
      <Menu>
        <Menu.Item>
          <a onClick={() => { setDealParamsModalShow(coinPairChoice) }} disabled={!budget ? true : false}>交易参数设置</a>
        </Menu.Item>
      </Menu>
    );

    const startTrade = () => {
      Modal.confirm({
        title: `开始策略 - ${coinPairChoice.coinPair ? coinPairChoice.coinPair.name : ''}`,
        content: '您是否确定开启策略？',
        okText: '确认',
        cancelText: '我再想想',
        icon: null,
        onOk: () => {
          dispatch({ type: 'coinPairsDetails/startTrade', payload: coinPairChoice })
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

          <Row>
            <Col span={12}>
              <Row type='flex' justify='space-between' align='middle'>

                <Col style={{ color: 'red', fontWeight: 'bold' }}>{openPrice || 0}</Col>
                <Col>
                  <Tooltip placement="rightTop" title={'收益比'}>
                    <span className={style.earnings_ratio} style={{ fontWeight: 'bold' }}>----</span>
                  </Tooltip>
                </Col>

                <Col className={style.status} >
                  <Tooltip placement="rightTop" title={'未开始策略'}>
                    <img style={{ width: '15px' }} src={not_trade_icon} alt='' />
                  </Tooltip>
                </Col>
              </Row>
            </Col>

            <Col span={12}>
              <Row type='flex' justify='end' align='middle'>
                <Button onClick={() => { startTrade() }} disabled={!budget ? true : false} style={{ marginRight: '15px' }}  >开始策略</Button>
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
                <span>---</span>
                <Popover
                  content={`预算:${budget && budget !== '0' ? coin_base_two_num(budget, activeItem) : '---'} ${activeItem.coin.name.toUpperCase()}`}
                  trigger="hover"
                >
                  <img src={cost_icon} alt='' style={{ marginLeft: '20px', width: '20px' }} />
                </Popover>
              </div>
            </Col>
            <Col span={6}>
              <div className={style.top_row_title}>持仓均价</div>
              <div>---</div>
            </Col>
            <Col span={6}>
              <div className={style.top_row_title}>持仓数量</div>
              <Row type='flex' justify='start' align='middle'>
                <span>---</span>
                <Tooltip placement="rightTop" title={'交易货币数量不足'}>
                  <Icon
                    type='warning'
                    style={{
                      color: 'red',
                      display: is_insufficient_transaction_currency(trade_status, symbol_balance, position_num)
                    }}
                    className={style.card_item_icon}
                  />
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
              <div>---</div>
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

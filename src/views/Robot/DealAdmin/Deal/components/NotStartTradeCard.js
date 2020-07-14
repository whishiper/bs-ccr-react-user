import React, { Component } from 'react';
import { coin_base_two_num } from 'utils';
import { Row, Col, Icon, Card, Dropdown, Tooltip, Button, Spin } from 'antd';

import { routerRedux } from "dva/router";
import not_trade_icon from 'assets/not_trade_icon.svg'
import '../index.less'

class NotStartTradeCard extends Component {

  render() {
    const { props } = this;
    const { menu2, activeItem, freeCoinPairItem, startTrade, dispatch, sign,tradePatformApiId } = props;

    const {
      openPrice,
      coinPair,
      budget, //  预算
      id,
      symbol_balance,
      loading
    } = freeCoinPairItem;

    const findCoinPairsDetails = () => {
      console.log(sign,'----',id)
      sessionStorage.setItem('activeItem', JSON.stringify(activeItem))
      sessionStorage.setItem('symbol_balance', JSON.stringify(symbol_balance || {}))
      dispatch(routerRedux.push(`/ccr/coin/details/${id}/${sign}/${tradePatformApiId}`));
    }

    const actions = () => {

      return [
        <Button
          style={{ fontSize: '12px', width: '100%',height:'50px',lineHeight:'50px' }}
          onClick={() => { startTrade(freeCoinPairItem) }}
          disabled={!budget ? true : false}
          type='link'
        >开始策略</Button>,
        <Dropdown trigger={['click']} overlay={menu2} placement="bottomCenter">
          <Button style={{ fontSize: '12px', width: '100%',height:'50px',lineHeight:'50px' }} type='link'>
            更多 <Icon type="down" />
          </Button>
        </Dropdown>,
        <Button
          style={{ fontSize: '12px', width: '100%',height:'50px',lineHeight:'50px' }}
          type='link'
          onClick={findCoinPairsDetails}
        >
          详情 <Icon type="double-right" />
        </Button>
      ]

    }
    return (
      <Spin tip="Loading..." spinning={loading} delay="120">
        <Card hoverable={true} actions={actions()} className='start_trade_card'>

          <Row type='flex' justify='start' align='middle'>

            <Col style={{ fontSize: '12px', fontWeight: 'bold' }} span={8}>
              {coinPair ? coinPair.name.toUpperCase() : ''}
            </Col>

            <Tooltip placement="rightTop" title={'未开始策略'}>
              <img style={{ width: '15px' }} src={not_trade_icon} alt='' />
            </Tooltip>

          </Row>

          <Row type='flex' justify='space-between' style={{ height: '42px' }}>
            <Col style={{ color: 'red', height: '20px' }}>{openPrice || 0}</Col>
          </Row>

          <Row type='flex' justify='space-between' align='middle'>
            <Col style={{ fontSize: '12px', textAlign: 'left' }} span={8}> --- <br />持仓费用</Col>
            <Col style={{ fontSize: '12px', textAlign: 'center' }} span={8}>---<br />持仓均价 </Col>
            <Col style={{ fontSize: '12px', textAlign: 'right' }} span={8}>
              {budget && budget !== '0' ? coin_base_two_num(budget, activeItem) : '---'}<br />预算
            </Col>
          </Row>

        </Card>
      </Spin>
    );
  }
}

export default NotStartTradeCard;

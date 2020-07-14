import React, { Component } from 'react'
import { Row, Col, Card } from 'antd'
import style from './index.less'
import { trade_way } from 'utils/handlerResults'

export default class OrderGroup extends Component {
  render() {
    const { orderGroupData, symbol } = this.props
    const {
      name,
      endProfitRatio,
      totalSell,
      endType,
      totalCast,
      totalProfit,
      buildNumbers,
    } = orderGroupData

    const OrderItem = ({ key1, key2 }) => (
      <>
        <Row type='flex' justify='space-between' align='middle'>
          <Col className={style.cloum_line}>{key1.name}</Col>
          <Col>{key1.value1}</Col>
          <Col>{key1.value2}</Col>
        </Row>
        <Row type='flex' justify='space-between' align='middle'>
          <Col className={style.row_line}>{key2.name}</Col>
          <Col>{key2.value1}</Col>
          <Col>{key2.value2}</Col>
        </Row>
      </>
    )

    return (
      <Card title="订单组概览" bordered>
        <Row type='flex' justify='space-between' align='middle'>
          <Col>订单数</Col>
          <Col>{name || '---'}</Col>
          <Col></Col>
        </Row>
        <OrderItem
          key1={{ name: 'AI建仓', value1: `${buildNumbers || '---'}`, value2: '次' }}
          key2={{ name: '网格建仓', value1: '即将到来', value2: '' }}
        />
        <OrderItem
          key1={{ name: '累计卖出', value1: `${totalSell || 0}`, value2: `${symbol.base_currency.toUpperCase()}` }}
          key2={{ name: '网格卖出', value1: '即将到来', value2: '' }}
        />
        <OrderItem
          key1={{ name: '累计费用', value1: `${totalCast || 0}`, value2: `${symbol.quote_currency.toUpperCase()}` }}
          key2={{ name: '网格费用', value1: '即将到来', value2: '' }}
        />
        <OrderItem
          key1={{ name: '累计盈利', value1: `${totalProfit || 0}`, value2: `${symbol.quote_currency.toUpperCase()}` }}
          key2={{ name: '网格盈利', value1: '即将到来', value2: '' }}
        />
        <Row type='flex' justify='space-between' align='middle' style={{ paddingTop: '25px' }}>
          <Col>收益比</Col>
          <Col>{endProfitRatio ? endProfitRatio : 0}</Col>
          <Col></Col>
        </Row>
        <Row type='flex' justify='space-between' align='middle' style={{ paddingTop: '25px' }}>
          <Col>结单方式</Col>
          <Col>{endType ? trade_way(endType) : '---'}</Col>
          <Col></Col>
        </Row>
      </Card>
    )
  }
}

import React, { Component } from 'react'
import { Row, Col, Divider, Affix } from 'antd';
import style from './index.less'

export default class TradeFooter extends Component {
  render() {
    const { profitSumUp, coinName } = this.props
    const { count, totalTradeCost } = profitSumUp
    return (
      <Affix offsetBottom={0} style={{ height: '50px', zIndex: 100 }}>
        <Row className={style.footer}>
          <Col className={style.footer_item}>
            <>买入单数:</>
            <span style={{ color: '#2E8B57', margin: '0 10px' }}>{count || 0}</span>
            <> 组</>
          </Col>
          <Divider type="vertical" style={{ height: '30px' }} />
          <Col className={style.footer_item}>
            <>买入总费用:</>
            <span style={{ color: '#2E8B57', margin: '0 10px' }}>{totalTradeCost || 0}</span>
            <> {coinName ? coinName.toUpperCase() : ''}</>
          </Col>
          {/* <Divider type="vertical" style={{ height: '30px' }} />
          <Col className={style.footer_item}>
            追踪盈利:
          <span style={{ color: '#2E8B57', margin: '0 10px' }}>0</span>
            USDT
        </Col> */}
        </Row>
      </Affix>
    )
  }
}

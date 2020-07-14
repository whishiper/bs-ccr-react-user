import React, { Component } from 'react'
import { Row, Col, Divider, Icon } from 'antd';
import style from './index.less'

export default class Footer extends Component {

  state = {
    isopend: false
  }

  componentDidMount() {
    this.setState({ isopend: false })
  }

  showTrackProfit = () => {
    this.setState({ isopend: true })
  }

  hideTrackProfit = () => {
    this.setState({ isopend: false })
  }

  render() {
    const { isopend } = this.state
    const { overviewData, symbol } = this.props
    const {
      coinPairName,
      endNumbers,
      totalProfit,
      trackProfit
    } = overviewData

    return (
      // <Affix offsetBottom={0}>

      <Row className={style.footer}>
        <Col className={style.footer_item}>
          <span style={{ marginRight: '20px' }}>
            <span style={{ marginRight: '10px' }}>{coinPairName ? coinPairName.toUpperCase() : '无'}</span>
            <span>交易总览</span>
          </span>
          <span>
            <>  结单订单组:</>
            <span style={{ color: '#2E8B57', margin: '0 10px' }}>{endNumbers || 0}</span>
            <> 组</>
          </span>
        </Col>
        <Divider type="vertical" style={{ height: '30px' }} />
        <Col className={style.footer_item}>
          <span> 累计盈利:</span>
          <span style={{ color: '#2E8B57', margin: '0 10px' }}>{totalProfit || 0}</span>
          <span>{symbol.quote_currency.toUpperCase()}</span>
        </Col>
        <Divider type="vertical" style={{ height: '30px' }} />
        <Col className={style.footer_item}>

          {
            isopend
              ?
              <>
                <span>追踪盈利:</span>
                <span style={{ color: '#2E8B57', margin: '0 10px' }}>{trackProfit || 0}</span>
                <span>{symbol.quote_currency.toUpperCase()}</span>
                <Icon style={{ marginLeft: '8px' }} type="eye-invisible" onClick={() => this.hideTrackProfit()} />
              </>
              : <Icon type="eye" onClick={() => this.showTrackProfit()} />
          }
        </Col>
      </Row>
      // </Affix>
    )
  }
}

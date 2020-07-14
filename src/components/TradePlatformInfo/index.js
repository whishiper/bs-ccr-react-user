import React, { Component } from 'react'
import { Row, Col, Divider } from 'antd'
import style from './index.less'

class TradePlatformInfo extends Component {

  render() {
    const { tradePatformApi, robotId } = this.props
    const { tradePlatform, nickname } = tradePatformApi

    return (
      <Row type='flex' justify='space-between' align='middle' style={{ padding: '20px 0' }}>
        <Col className={style.logo}>
          <img src={tradePlatform ? `http://yun-img.bosenkeji.cn${tradePlatform.logo}` : ''} alt='' />
        </Col>
        <Col className={style.info}>
          <span className={style.title}>
            交易平台<br />
            <span>{tradePlatform ? tradePlatform.name : ''}</span>
          </span>
          <Divider style={{ height: '40px' }} type="vertical" />
          <span className={style.title}>
            API别名<br />
            < span>{nickname || ''}</ span>
          </span>
          <Divider style={{ height: '40px' }} type="vertical" />
          <span className={style.title}>
            机器人编号<br />
            <span>{robotId || ''}</span>
          </span>
        </Col>
      </Row>
    )
  }
}

export default TradePlatformInfo
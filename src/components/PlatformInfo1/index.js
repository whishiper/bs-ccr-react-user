import React, { Component } from 'react'
import { Row, Col, Divider } from 'antd'
import { connect } from "dva";
import style from './index.less'

@connect(({ common }) => ({ common }))

class PlatformInfo extends Component {
  componentDidMount() {
    const { dispatch, tradePatformApiId } = this.props
    dispatch({
      type: 'common/getTradePatformApi',
      payload: {
        tradePatformApiId
      }
    })
  }
  render() {
    const { common } = this.props
    const { tradePatformApi } = common
    const { tradePlatform, nickname, sign } = tradePatformApi

    return (
      <Row type='flex' justify='space-between' align='middle' style={{ padding: '20px 0' }}>
        <Col className={style.logo}>
          <img src={tradePlatform ? tradePlatform.logo : ''} alt='12' />
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
            <span>{sign || ''}</span>
          </span>
        </Col>
      </Row>
    )
  }
}

export default PlatformInfo
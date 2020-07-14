import React, { Component } from 'react'
import { Row, Col, Divider, Affix, Icon } from 'antd';
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
    const { profitSumUp, coinName } = this.props
    const { count, totalShellProfit, totalTrackProfit } = profitSumUp
    return (
      <Affix offsetBottom={0} style={{ height: '50px' }}>

        <Row
          className={style.footer}
        >
          <Col className={style.footer_item}>
            <span>止盈单数:</span>
            <span style={{ color: '#2E8B57', margin: '0 10px' }}>{count || 0}</span>
            <span>组</span>
          </Col>
          <Divider type="vertical" style={{ height: '30px' }} />
          <Col className={style.footer_item}>
            合计盈利:
            <span style={{ color: '#2E8B57', margin: '0 10px' }}>{totalShellProfit || 0}</span>
            <span>{coinName ? coinName.toUpperCase() : ''}</span>
          </Col>
          <Divider type="vertical" style={{ height: '30px' }} />
          <Col className={style.footer_item}>

            {
              isopend
                ?
                <>
                  追踪盈利:
                <span style={{ color: '#2E8B57', margin: '0 10px' }}>{totalTrackProfit || 0}</span>
                  <span>{coinName ? coinName.toUpperCase() : ''}</span>
                  <Icon style={{ marginLeft: '8px' }} type="eye-invisible" onClick={() => this.hideTrackProfit()} />
                </>
                : <Icon type="eye" onClick={() => this.showTrackProfit()} />
            }

          </Col>
        </Row>
      </Affix>
    )
  }
}

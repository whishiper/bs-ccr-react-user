import React, { Component } from 'react'
import { Row, Col, Icon, Empty } from 'antd';
import style from './index.less'


class TradeButtonGroup extends Component {
  render() {
    const {
      moreShow,
      coinPair,
      handleCoinPairChange,
      handleMoreShwo,
      handleAllCoinPair,
      handleCancelAllCoinPair
    } = this.props;
    return (
      <div className={moreShow ? style.warpper : null}>
        <Row className={style.main} >
          <Col className={style.left}>货币对：</Col>
          <Col className={moreShow ? `${style.group} ${style.group_active}` : style.group}>
            {
              coinPair
                ?
                coinPair.map(item => (
                  <span
                    key={item.id}
                    className={item.checked ? `${style.but_checked} ${style.but}` : style.but}
                    onClick={() => handleCoinPairChange(item)}
                  >
                    {item.name}
                  </span>
                ))
                :
                <Empty />
            }
          </Col>
          <Col className={style.right}>
            <a onClick={() => { handleMoreShwo() }}>
              {
                !moreShow
                  ?
                  <>更多<Icon type="down-square" style={{ marginLeft: '5px' }} /></>
                  :
                  <>收起<Icon type="up-square" style={{ marginLeft: '5px' }} /></>
              }
            </a>
          </Col>
        </Row>
        <div style={{ marginLeft: '70px', display: moreShow ? 'block' : 'none' }}>
          <a style={{ marginRight: '20px' }} onClick={() => { handleAllCoinPair() }}>选择所有</a>
          <a onClick={() => { handleCancelAllCoinPair() }}>取消选择</a>
        </div>
      </div>
    )
  }
}
export default TradeButtonGroup;

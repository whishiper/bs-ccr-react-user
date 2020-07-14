import React, { Component } from 'react'
import { Row, Col, Icon, Radio } from 'antd';
import { connect } from "dva";
import style from './index.less'
import './antd.less'

@connect(({ tradeHistory }) => ({ tradeHistory }))

class CoinPairButtonGroup extends Component {

  state = {
    moreShow: true,
  }

  render() {

    const { dispatch, orderGroupList, orderGroupId } = this.props;


    const handleOrderGroupChange = (e) => {
      dispatch({
        type: 'tradeHistory/handleOrderGroupChange',
        payload: {
          orderGroupId: e.target.value
        }
      })
    }

    const handleMoreOrderGroup = () => {

      dispatch({
        type: 'tradeHistory/handleMoreOrderGroup'
      })
    }

    const handleMoreShwo = () => {

      this.setState({ moreShow: false })
    }
    const handleMoreHidle = () => {

      this.setState({ moreShow: true })
    }

    const { moreShow } = this.state

    return (
      <Row className={style.main} >
        <Col className={style.left}>订单组：</Col>
        <Col className={`${style.group} ${style.group_active}`}>
          <span className='trade_radio_group'>
            <Radio.Group value={Number(orderGroupId)} onChange={(e) => handleOrderGroupChange(e)} >
              {
                orderGroupList.map(item => (
                  <Radio.Button key={item.id} value={Number(item.id)}>{item.name}</Radio.Button>
                ))
              }
            </Radio.Group>
          </span>
        </Col>
        <Col className={style.right}>
          <a onClick={() => { handleMoreOrderGroup() }}>
            <>更多<Icon type="down-square" style={{ marginLeft: '5px' }} /></>
          </a>

          {/* {
            moreShow
              ?
              <span onClick={() => handleMoreShwo()}>更多<Icon type="mail" style={{ marginLeft: '5px' }} /></span>
              :
              <span onClick={() =>handleMoreHidle()}>收起<Icon type="mail" rotate={180} style={{ marginLeft: '5px' }} /></span>
          } */}
        </Col>
      </Row>
    )
  }
}
export default CoinPairButtonGroup;

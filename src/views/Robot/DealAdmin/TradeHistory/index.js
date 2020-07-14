import React, { Component } from 'react'
import { Table, Row, Col } from 'antd'
import { connect } from "dva";
import NewPageHeader from 'components/NewPageHeader/index';
import TradeTime from 'components/TradeTime'
import CoinPairButtonGroup from './components/CoinPairButtonGroup'
import OrderGroup from './components/OrderGroup'
import Footer from './components/Footer'
import style from './index.less';

@connect(({ tradeHistory }) => ({ tradeHistory }))

class TradeHistory extends Component {
  componentDidMount() {
    const { dispatch, match } = this.props
    const { params } = match
    const { id } = params


    dispatch({
      type: 'tradeHistory/updateState',
      payload: {
        coinPairChoiceId: id,
        orderGroupList: [],
        orderGroupData: {},
        tradeOrdersList: [],
        total: 0,
        page: 1,
        time: 'all',
      }
    })
    dispatch({
      type: 'tradeHistory/getTradeOverview',
      payload: {
        coinPairChoiceId: id
      }
    })
    dispatch({
      type: 'tradeHistory/searchOrderGroup',
      payload: { id }
    })
  }
  render() {
    const { history, tradeHistory, dispatch } = this.props;
    const { tradeOrdersList, time, orderGroupList, orderGroupId, overviewData, orderGroupData } = tradeHistory
    let symbol = JSON.parse(sessionStorage.getItem('symbol')) || {}

    const handleTimeChange = (e) => {
      dispatch({
        type: "tradeHistory/handleTimeChange",
        payload: e
      })
    }
    const rangePickerOnChange = (e) => {
      dispatch({
        type: "tradeHistory/rangePickerOnChange",
        payload: e
      })
    }

    const onBack = () => {
      history.goBack()
    }

    const columns = [{
      align: "center",
      title: "订单信息",
      dataIndex: "new_name",
      key: "new_name"
    },
    {
      align: "center",
      title: "交易时间",
      dataIndex: "createdAt",
      key: "createdAt"
    },
    {
      align: "center",
      title: "交易均价",
      dataIndex: "tradeAveragePrice",
      key: "tradeAveragePrice"
    },
    {
      align: "center",
      title: "交易数量",
      dataIndex: "tradeNumbers",
      key: "tradeNumbers"
    },
    {
      align: "center",
      title: "交易费用",
      dataIndex: "tradeCost",
      key: "tradeCost"
    },
    {
      align: "center",
      title: "卖出总结",
      dataIndex: "sellProfit",
      key: "sellProfit"
    },
    {
      align: "center",
      title: "交易方式",
      dataIndex: "tradeType",
      key: "tradeType"
    },
    ];

    return (
      <>
        <NewPageHeader title={'交易记录'} onBack={onBack} />
        <div className={style.main}>
          <TradeTime
            time={time}
            handleTimeChange={handleTimeChange}
            rangePickerOnChange={rangePickerOnChange} />
          <CoinPairButtonGroup
            dispatch={dispatch}
            orderGroupId={orderGroupId}
            orderGroupList={orderGroupList} />
          <Row>
            <Col span={18}>
              <Table
                columns={columns}
                dataSource={tradeOrdersList}
              />
            </Col>
            <Col span={5} offset={1}>
              <OrderGroup orderGroupData={orderGroupData} symbol={symbol} />
            </Col>
          </Row>

        </div>
        <Footer overviewData={overviewData} symbol={symbol} />
      </>
    )
  }
}
export default TradeHistory
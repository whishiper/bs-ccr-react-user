import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import NewPageHeader from 'components/NewPageHeader';
import StartTradeInfo from './components/StartTradeInfo'
import EtcTable from './components/EtcTable'
import SetTradeParamModal from './components/SetTradeParamModal'
import NotStartTradeInfo from './components/NotStartTradeInfo'
import { is_start_trade } from 'utils/handlerResults'
import style from './index.less';

@connect(({ coinPairsDetails }) => ({ coinPairsDetails }))

class CoinPairsDetails extends Component {

  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match

    dispatch({
      type: 'coinPairsDetails/start', payload: Object.assign(params, {
        startWebsocket: this.startWebsocket,
        closeWebsocket: this.closeWebsocket
      }),
    })

  }

  // 限载页面
  componentWillUnmount() {
    this.closeWebsocket()
  }

  // 开起 websocket
  startWebsocket = ({ symbols, webSocketName }) => {
    this.startGetAoleWebsocket({ symbols, webSocketName })
  }

  // 关闭 websocket 
  closeWebsocket = () => {
    this.closeGetAoleWebsocket()
  }

  // 获取 货币对最新报价 webSocket
  startGetAoleWebsocket({ symbols, webSocketName }) {
    const that = this

    if (webSocketName) {
      webSocketName.init({
        symbols: symbols,
        getOpenPrice: (value) => {
          that.getOpenPrice(value)
        }
      })
    }

  }

  getOpenPrice(values) {
    const { coinPairsDetails, dispatch } = this.props;
    const { coinPairChoice } = coinPairsDetails
    console.log(values, '----values')

    if (values && Reflect.has(values, 'openPrice') && Reflect.get(values, 'openPrice')) {
      dispatch({
        type: 'coinPairsDetails/updateState', payload: {
          coinPairChoice: Object.assign(coinPairChoice, values)
        }
      })
    }

  }

  // 关闭获取最新报价 webSocket
  closeGetAoleWebsocket = () => {
    const { coinPairsDetails } = this.props;
    const { webSocketName } = coinPairsDetails
    if (webSocketName) {
      webSocketName.close()
    }
  }

  render() {

    const { history, match, dispatch, coinPairsDetails } = this.props
    const { loading, coinPairChoice, list, isOpenSetTradeParam, tradeParamForm } = coinPairsDetails

    const onBack = () => {
      history.goBack()
    }

    const setDealParamsModalOk = (values) => {
      dispatch({
        type: 'coinPairsDetails/setDealParamsModalOk',
        payload: values
      })
    }

    const setDealParamsModalCancel = (form) => {
      dispatch({
        type: 'coinPairsDetails/setDealParamsModalCancel',
        payload: form
      })
    }

    return (
      <div className={style.warpper}>
        <NewPageHeader title={'货币对详情'} onBack={onBack} />
        <div className={style.main}>
          {
            !is_start_trade(coinPairChoice.trade_status)
              ?
              <StartTradeInfo
                dispatch={dispatch}
                coinPairChoice={coinPairChoice}
                match={match} />
              :
              <NotStartTradeInfo
                dispatch={dispatch}
                coinPairChoice={coinPairChoice}
                match={match} />
          }

          <Spin tip="Loading..." spinning={loading} delay="120">
            <EtcTable list={list} />
          </Spin>

          <SetTradeParamModal
            dealParamsForm={tradeParamForm}
            visible={isOpenSetTradeParam}
            handleOk={setDealParamsModalOk}
            handleCancel={setDealParamsModalCancel}
          />
        </div>
      </div>
    );
  }
}

export default CoinPairsDetails;

import React, { Component } from 'react';
import { connect } from "dva";
import { Table } from 'antd';
import NewPageHeader from 'components/NewPageHeader';
import TradePlatformInfo from 'components/TradePlatformInfo'
import TradeTime from 'components/TradeTime'
import TradeTabs from 'components/TradeTabs'
import TradeButtonGroup from 'components/TradeButtonGroup'
import TradeFooter from 'components/TradeFooter'

import style from './index.less';

@connect(({ buyLogs, global }) => ({ buyLogs, global }))

class BuyLogs extends Component {

  componentDidMount() {
    const { dispatch, match } = this.props
    const { params } = match
    const { tradePatformApiId, tradePlatformId, robotBindApiId } = params

    dispatch({
      type: 'global/start', payload: {
        tradePatformApiId,
        tradePlatformId,
        robotBindApiId,
        fn: {
          type: 'buyLogs/hadleTabsChange',
        }
      }
    })

  }

  render() {
    const { history, buyLogs, global, dispatch, match } = this.props;
    const { page, pageSize, total, profitList, time, profitSumUp, coinPair, moreShow ,coinName} = buyLogs
    const { tradePatformInfo, coinSortList, tabsActive } = global
    const { params } = match
    const { robotBindApiId,robotId } = params

    console.log(coinPair, 'coinPair')

    const hadleTabsChange = (e) => {
      dispatch({
        type: 'buyLogs/hadleTabsChange', payload: {
          tabsActive: e.target.value,
          robotBindApiId,
          coinName:e.target.coinName
        }
      })
    }

    const handleCoinPairChange = (value) => {
      dispatch({
        type: 'buyLogs/handleCoinPairChange',
        payload: value
      })
    }

    const handleMoreShwo = () => {

      dispatch({
        type: 'buyLogs/updateState',
        payload: {
          moreShow: !moreShow
        }
      })
    }
    const handleAllCoinPair = () => {
      dispatch({
        type: 'buyLogs/handleAllCoinPair'
      })
    }

    const handleCancelAllCoinPair = () => {
      dispatch({
        type: 'buyLogs/handleCancelAllCoinPair'
      })
    }

    const columns = [{
      align: "center",
      title: "货币对",
      dataIndex: "coinPairName",
      key: "coinPairName"
    },
    {
      align: "center",
      title: "买入时间",
      dataIndex: "createAt",
      key: "createAt"
    },
    {
      align: "center",
      title: "买入数量",
      dataIndex: "tradeNumbers",
      key: "tradeNumbers"
    },
    {
      align: "center",
      title: "买入费用",
      dataIndex: "tradeCost",
      key: "tradeCost",
    },
    ];

    const pagination = {
      defaultCurrent: 1,
      pageSize,
      current: page,
      total,
      showQuickJumper: true,
      onChange: _page => {
        dispatch({
          type: "buyLogs/oPaginationChange",
          payload: _page
        });
      }
    };

    const handleTimeChange = (e) => {
      dispatch({
        type: "buyLogs/handleTimeChange",
        payload: e
      })
    }

    const rangePickerOnChange = (e) => {
      dispatch({
        type: "buyLogs/rangePickerOnChange",
        payload: e
      })
    }

    const onBack = () => {
      history.goBack()
    }

    return (
      <>
        <NewPageHeader title='买入日志' onBack={onBack} />
        <div className={style.main}>
          <TradePlatformInfo
            robotId={robotId}
            tradePatformApi={tradePatformInfo} />
          <TradeTabs
            hadleTabsChange={hadleTabsChange}
            coinSortList={coinSortList}
            tabsActive={tabsActive} />
          <TradeTime
            time={time}
            handleTimeChange={handleTimeChange}
            rangePickerOnChange={rangePickerOnChange} />
          <TradeButtonGroup
            moreShow={moreShow}
            coinPair={coinPair}
            handleMoreShwo={handleMoreShwo}
            handleCoinPairChange={handleCoinPairChange}
            handleCancelAllCoinPair={handleCancelAllCoinPair}
            handleAllCoinPair={handleAllCoinPair} />
          <Table
            columns={columns}
            dataSource={profitList}
            pagination={pagination} />
        </div>
        <TradeFooter profitSumUp={profitSumUp} coinName={coinName} />
      </>
    );
  }
}

export default BuyLogs;

import React, { Component } from 'react';
import { connect } from "dva";
import { Table } from 'antd';
import NewPageHeader from 'components/NewPageHeader';
import TradePlatformInfo from 'components/TradePlatformInfo'
import TradeTime from 'components/TradeTime'
import TradeTabs from 'components/TradeTabs'
import TradeButtonGroup from 'components/TradeButtonGroup'
import Footer from './components/Footer'

import style from './index.less';
@connect(({ profitSummary, global }) => ({ profitSummary, global }))

class ProfitSummary extends Component {

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
          type: 'profitSummary/hadleTabsChange',
        }
      }
    })

  }

  render() {
    const { history, profitSummary, global, dispatch, match } = this.props;
    const { page, pageSize, total, profitList, time, profitSumUp, coinPair, moreShow, coinName } = profitSummary

    const { tradePatformInfo, coinSortList, tabsActive } = global
    const { params } = match
    const { robotBindApiId, robotId } = params

    const hadleTabsChange = (e) => {
      dispatch({
        type: 'profitSummary/hadleTabsChange', payload: {
          tabsActive: e.target.value,
          robotBindApiId,
          coinName: e.target.coinName
        }
      })
    }

    const handleCoinPairChange = (value) => {
      dispatch({
        type: 'profitSummary/handleCoinPairChange',
        payload: value
      })
    }

    const handleMoreShwo = () => {

      dispatch({
        type: 'profitSummary/updateState',
        payload: {
          moreShow: !moreShow
        }
      })
    }
    const handleAllCoinPair = () => {
      dispatch({
        type: 'profitSummary/handleAllCoinPair'
      })
    }

    const handleCancelAllCoinPair = () => {
      dispatch({
        type: 'profitSummary/handleCancelAllCoinPair'
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
      title: "卖出时间",
      dataIndex: "createAt",
      key: "createAt"
    },
    {
      align: "center",
      title: "卖出数量",
      dataIndex: "tradeNumbers",
      key: "tradeNumbers"
    },
    {
      align: "center",
      title: "卖出总收益",
      dataIndex: "shellProfit",
      key: "shellProfit"
    },
    {
      align: "center",
      title: "收益率（%）",
      dataIndex: "endProfitRatio",
      key: "endProfitRatio",
      render: text => (<span style={{ color: "#2E8B57" }}>
        {`${((text-1)*100).toFixed(4)}`}
      </span>)
    },
    {
      align: "center",
      title: "交易方式",
      dataIndex: "tradeType",
      key: "tradeType",
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
          type: "profitSummary/oPaginationChange",
          payload: _page
        });
      }
    };


    const handleTimeChange = (e) => {
      dispatch({
        type: "profitSummary/handleTimeChange",
        payload: e
      })
    }
    const rangePickerOnChange = (e) => {
      dispatch({
        type: "profitSummary/rangePickerOnChange",
        payload: e
      })
    }
    const onBack = () => {
      history.goBack()
    }

    return (
      <>
        <NewPageHeader title='收益总结' onBack={onBack} />
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
        <Footer profitSumUp={profitSumUp} coinName={coinName} />
      </>
    );
  }
}

export default ProfitSummary;

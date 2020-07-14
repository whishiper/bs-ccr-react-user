import React, { Component } from 'react';
import { connect } from 'dva';
import Media from 'react-media';
import { Row, Col, Input, Table, Button, Spin } from 'antd';
import NewPageHeader from 'components/NewPageHeader/index';

import style from './index.less';
const Search = Input.Search;
@connect(({ addCoinPairs, dealAdmin }) => ({ addCoinPairs, dealAdmin }))

class AddCoinPairs extends Component {
  componentDidMount() {
    const { dispatch, match } = this.props
    const { params } = match
    dispatch({
      type: 'addCoinPairs/start', payload: Object.assign(params, {
        startWebsocket: this.startWebsocket,
        closeWebsocket: this.closeWebsocket
      })
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
    const { addCoinPairs, dispatch } = this.props;
    const { tableData } = addCoinPairs
    // console.log(values, '----values')
    let newTableData = tableData.map(item => (item.currencyPair === values.symbol)&& Reflect.has(values, 'openPrice') && Reflect.get(values, 'openPrice')
      ? Object.assign(item, values)
      : item)
      // console.log(newTableData,'-----newTableData')
    dispatch({
      type: 'addCoinPairs/updateState', payload: {
        tableData: newTableData
      }
    })
  }

  // 关闭获取最新报价 webSocket
  closeGetAoleWebsocket = () => {
    const { addCoinPairs } = this.props;
    const { webSocketName } = addCoinPairs
    if (webSocketName) {
      webSocketName.close()
    }
  }

  render() {

    const { addCoinPairs, dispatch, history, match } = this.props
    const { pageSize, page, total, tableData, quotCurrencyName, loading, searchValue } = addCoinPairs
    const { params } = match
    const { robotBindApiId, id } = params

    const addAoinPairChoice = (value) => {

      dispatch({
        type: 'addCoinPairs/addAoinPairChoice', payload: {
          value: Object.assign(value, { id, robotBindApiId }),
          history
        }
      })
    }

    const columns = [{
      align: 'center',
      title: '货币对',
      dataIndex: 'currencyPair',
      key: 'currencyPair'
    }, {
      align: 'center',
      title: '最新价',
      dataIndex: 'openPrice',
      key: 'openPrice',
      render: (text) => (
        <span style={{ color: '#3CB371' }}>{text || '---'}</span>
      )
    },
    {
      align: 'center',
      title: '分区',
      dataIndex: 'partition',
      key: 'partition'
    },
    {
      align: 'center',
      title: '操作',
      dataIndex: 'is_choice',
      key: 'is_choice',
      render: (_, record) => (
        <Button
          type="link"
          style={{ cursor: 'pointer' }}
          disabled={record.is_choice}
          onClick={() => { addAoinPairChoice(record) }}
        >添加自选</Button>
      )
    }];

    const mobile_columns = columns.filter(item => item.title !== '分区')

    const oPaginationChange = {
      defaultCurrent: 1,
      pageSize,
      current: page,
      total,
      onChange: (page) => {
        dispatch({
          type: 'addCoinPairs/oPaginationChange',
          payload: page
        })
      }
    }

    const searchCoinPairs = (value) => {
      dispatch({ type: 'addCoinPairs/searchCoinPairs' })
    }

    const onBack = () => {
      history.goBack()
    }

    const onSearchOfficial = () => {
      dispatch({ type: 'addCoinPairs/onSearchOfficial' })
    }

    const onSearchPopular = () => {
      dispatch({ type: 'addCoinPairs/onSearchPopular' })
    }

    const onSearchChange = (e) => {
      dispatch({ type: 'addCoinPairs/updateState', payload: { searchValue: e.target.value } })
    }

    return (
      <>
        <div className={style.warpper}>
          <NewPageHeader title={`添加货币对 - ${quotCurrencyName ? quotCurrencyName.toUpperCase() : ''}`} onBack={onBack} />
        </div>
        <Spin tip="Loading..." spinning={loading} delay="120">
          <div>
            <Row type='flex' justify='center' align='middle' style={{ padding: '25px 0' }}>
              <Col className={style.row_name}>手动搜索</Col>
              <Col xs={15} sm={15} md={15} lg={15} xl={15} className={style.search}>
                <Search
                  placeholder="请输入交易货币英文名（含大小写）"
                  onChange={onSearchChange}
                  value={searchValue}
                  onSearch={(value) => { searchCoinPairs(value) }}
                />
                <div className={style.tips}>添加货币对后需要设置预算才能交易</div>
              </Col>
            </Row>
            <Row type='flex' justify='center' align='middle' style={{ padding: '20px 10px' }}>
              <Col className={style.row_name}>快速搜索</Col>
              <Col xs={15} sm={15} md={15} lg={15} xl={15}>
                <span
                  className={style.search_fast}
                  style={{ color: '#1890ff' }}
                  onClick={onSearchOfficial}
                >官方推荐</span>
                <span
                  className={style.search_fast}
                  style={{ color: '#1890ff' }}
                  onClick={onSearchPopular}
                >主流货币对</span>
              </Col>
            </Row>
            {/* <Row type='flex' justify='center' align='middle' className={style.search_history} >
              <Col xs={6} sm={6} md={6} lg={3} xl={3} className={style.row_name}>搜索历史</Col>
              <Col xs={15} sm={15} md={15} lg={15} xl={15} className={style.search_history_col}>
                <a>ADAC</a>
                <a>ADAC</a>
              </Col>
            </Row> */}
            <Media query="(max-width: 768px)" render={() =>
              (
                <div style={{ margin: '0 15px' }}>
                  <Table columns={mobile_columns} dataSource={tableData} pagination={oPaginationChange} />
                </div>

              )}
            />
            <Media query="(min-width: 769px)" render={() =>
              (
                <Table columns={columns} dataSource={tableData} pagination={oPaginationChange} />
              )}
            />

          </div>
        </Spin>
      </>
    );
  }
}

export default AddCoinPairs;

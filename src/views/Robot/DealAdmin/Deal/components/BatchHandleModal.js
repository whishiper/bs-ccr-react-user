import React, { Component } from 'react';
import { Modal, Row, Divider, Table, message, Icon, Badge } from 'antd';

import { coin_base_two_num } from 'utils';

class BatchHandleModal extends Component {

  state = {
    selectedRowKeys: []
  }
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys })
  };

  batchPauseTrade = () => {
    const { dispatch } = this.props
    const { selectedRowKeys } = this.state
    if (selectedRowKeys.length === 0) {
      message.warning('请选择货币对')
      return
    }
    Modal.confirm({
      title: '批量暂停买入',
      content: '您是否确定批量操作暂停买入？',
      okText: '确认',
      cancelText: '我再想想',
      onOk: () => {

        dispatch({
          type: 'dealAdmin/batchPauseTrade', payload: selectedRowKeys
        })
        this.setState({ selectedRowKeys: [] })
      }
    });
  }

  batchRecoverBuy = () => {
    const { dispatch } = this.props
    const { selectedRowKeys } = this.state
    if (selectedRowKeys.length === 0) {
      message.warning('请选择货币对')
      return
    }
    Modal.confirm({
      title: '批量恢复买入',
      content: '您是否确定批量操作恢复买入？',
      okText: '确认',
      cancelText: '我再想想',
      onOk: () => {
        dispatch({
          type: 'dealAdmin/batchRecoverBuy', payload: selectedRowKeys
        })
        this.setState({ selectedRowKeys: [] })
      }
    });
  }

  batchStopProfitTrade = () => {
    const { dispatch } = this.props
    const { selectedRowKeys } = this.state
    if (selectedRowKeys.length === 0) {
      message.warning('请选择货币对')
      return
    }
    Modal.confirm({
      title: '批量止盈后停止',
      content: '您是否确定批量操作止盈后停止？',
      okText: '确认',
      cancelText: '我再想想',
      onOk: () => {
        dispatch({
          type: 'dealAdmin/batchStopProfitTrade', payload: selectedRowKeys
        })
        this.setState({ selectedRowKeys: [] })
      }
    });
  }

  batchCancelStopProfitTrade = () => {
    const { dispatch } = this.props
    const { selectedRowKeys } = this.state
    if (selectedRowKeys.length === 0) {
      message.warning('请选择货币对')
      return
    }
    Modal.confirm({
      title: '批量取消止盈后停止',
      content: '您是否确定批量操作取消止盈后停止？',
      okText: '确认',
      cancelText: '我再想想',
      onOk: () => {
        dispatch({
          type: 'dealAdmin/batchCancelStopProfitTrade', payload: selectedRowKeys
        })
        this.setState({ selectedRowKeys: [] })
      }
    });
  }

  batchSellAllOrders = () => {
    const { dispatch } = this.props
    const { selectedRowKeys } = this.state
    if (selectedRowKeys.length === 0) {
      message.warning('请选择货币对')
      return
    }
    Modal.confirm({
      title: '批量立即清仓',
      content: '您是否确定批量操作立即清仓？',
      okText: '确认',
      cancelText: '我再想想',
      onOk: () => {
        dispatch({
          type: 'dealAdmin/batchSellAllOrders', payload: selectedRowKeys
        })
        this.setState({ selectedRowKeys: [] })
      }
    });
  }

  render() {
    const { props } = this;
    const { visible, handleOk, handleCancel, list, activeItem, } = props;

    const columns = [{
      align: 'center',
      title: '货币对',
      width: 100,
      dataIndex: 'name',
      key: 'name',
    }, {
      align: 'center',
      title: '交易状态',
      width: 150,
      dataIndex: 'tradingState',
      key: 'tradingState',
      render: (_, record) => (
        <Row type='flex' justify='space-around' align='middle'>
          <Icon
            type="pause"
            style={{
              color: 'red',
              display: record.trade_status && Number(record.trade_status) === 3 ? 'block' : 'none',
            }}
          />
          <Icon
            type="caret-right"
            style={{
              color: '#3f8600',
              display: record.trade_status
                && (Number(record.trade_status) === 1 || record.is_set_stop_profit_trade && Number(record.is_set_stop_profit_trade) === 2)
                ?
                'block'
                :
                'none',
            }}
          />
          <Badge
            count={1}
            style={{
              backgroundColor: '#fff',
              color: '#1E90FF',
              boxShadow: '0 0 0 1px #d9d9d9 inset',
              display: record.is_set_stop_profit_trade
                && Number(record.is_set_stop_profit_trade) === 1
                ?
                'block'
                :
                'none',
              zIndex: '1'
            }}
          />
        </Row>
      )
    }, {
      align: 'center',
      title: '现价',
      width: 100,
      dataIndex: 'openPrice',
      key: 'openPrice'
    }, {
      align: 'center',
      title: '持仓数量',
      width: 120,
      dataIndex: 'position_num',
      key: 'position_num'
    }, {
      align: 'center',
      title: '持仓费用',
      width: 120,
      dataIndex: 'position_cost',
      key: 'position_cost',
      render: (text) => (
        <span style={{ color: '#2E8B57' }}>{coin_base_two_num(text, activeItem)}</span>
      )
    }, {
      align: 'center',
      title: '已做单数/最大建仓数',
      width: 220,
      dataIndex: 'bigPositionBuild',
      key: 'bigPositionBuild',
      render: (_, record) => (
        <span>{`${record.finished_order} / ${record.max_trade_order}`}</span>
      )
    }, {
      align: 'center',
      title: '最大预算',
      width: 120,
      dataIndex: 'budget',
      key: 'budget'
    }];

    const { selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <Modal
        title='批量操作'
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="提交"
        cancelText='取消'
        centered={true}
        footer={null}
        width={810}
      >
        <Row type='flex' justify='space-between' align='middle'>
          <a onClick={() => this.batchPauseTrade()}>暂停买入</a>
          <a onClick={() => this.batchRecoverBuy()}>恢复买入</a>
          <a onClick={() => this.batchStopProfitTrade()}>止盈后停止策略</a>
          <a onClick={() => this.batchCancelStopProfitTrade()}>取消止盈后停止策略</a>
          <a onClick={() => this.batchSellAllOrders()}>立即清仓</a>
        </Row>
        <Divider dashed />
        <Table
          rowSelection={rowSelection}
          columns={columns}
          scroll={{ y: 350 }}
          dataSource={list}
          pagination={false}
        />
      </Modal>
    );
  }
}

export default BatchHandleModal;

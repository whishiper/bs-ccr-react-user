import React, { Component } from 'react'
import { Card, Table } from 'antd';
import moment from 'moment'
// import { coin_base_two_num } from 'utils';

export default class EtcTable extends Component {
  render() {
    const { list } = this.props
    // let activeItem = JSON.parse(sessionStorage.getItem('activeItem')) || {}
    const columns = [
      {
        title: '订单',
        dataIndex: 'new_name',
        key: 'new_name',
      },
      {
        title: '买入时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '交易均价',
        dataIndex: 'tradeAveragePrice',
        key: 'tradeAveragePrice',
      },
      {
        title: '交易数量',
        dataIndex: 'tradeNumbers',
        key: 'tradeNumbers',
      },
      {
        title: '交易费用',
        dataIndex: 'tradeCost',
        key: 'tradeCost',
      },
      // {
      //   title: '理论建仓价',
      //   dataIndex: 'theoreticalBuildPrice',
      //   key: 'theoreticalBuildPrice',
      // },
      // {
      //   title: '实际建仓价',
      //   dataIndex: 'theoreticalBuildPrice',
      //   key: 'theoreticalBuildPrice',
      // },
      // {
      //   title: '收益比',
      //   dataIndex: 'profitRatio',
      //   key: 'profitRatio',
      //   render: (text) => <span style={{ color: text && Number(text) > 1 ? '#3f8600' : '#000' }}>{text ? coin_base_two_num(text, activeItem) : ''}</span>
      // },

    ];


    return (
      <div style={{ marginTop: '20px', background: 'white' }}>
        <Card title="持仓详情" bordered={false}>
          <Table columns={columns} dataSource={list} pagination={false} />
        </Card>
      </div>
    )
  }
}

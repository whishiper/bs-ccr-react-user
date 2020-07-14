import React, { Component } from 'react'
import { Typography } from "antd";

import style from './index.less'

const { Paragraph } = Typography;

export default class IPExplain extends Component {
  render() {
    const { ip,robotList } = this.props

    const new_robot_list = robotList.filter(item => item.tradePlatformName)

    console.log(new_robot_list, 'robotList----')
    return (
      <div>
        <div className={style.tips}>
          机器人会请根据不同的交易平台提供一个或多个最佳的IP，请按平台进行绑定（点击复制即可全部复制）
          </div>
        <div className={style.ip_item}>
          <span>huobi:</span>
          {
            ip.map(item => <span key={item}>{item || ''}</span>)
          }
          <a className={style.copy}>
            <Paragraph
              style={{ display: 'inline' }}
              onClick={(e) => { e.stopPropagation() }}
              copyable={{ text: `${ip.join(',')}` }} />
          </a>
        </div>
      </div>
    )
  }
}

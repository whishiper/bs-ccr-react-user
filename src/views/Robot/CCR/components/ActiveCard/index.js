import React, { Component } from 'react'
import style from './index.less'

export default class ActiveCard extends Component {
  render() {
    const{activeCodeModalShow} = this.props
    return (
      <div className={style.warpper}>
        <div className={style.title} onClick={()=>activeCodeModalShow()}>激活</div>
        <span>主人你还没有把我带回家呢，赶紧联系推荐人购买吧</span>
        <span>如果主人已经把我带回家了，请立即激活我吧</span>
      </div>
    )
  }
}

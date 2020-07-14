import React, { Component } from 'react'
import { Radio } from 'antd';
import style from './index.less';

export default class Tabs extends Component {

  render() {
    const { tabsActive, coinSortList, hadleTabsChange } = this.props
    return (
      <Radio.Group
        onChange={(e) => hadleTabsChange(e)}
        defaultValue={Number(tabsActive)}
        buttonStyle="solid"
        value={Number(tabsActive)}
        className={style.tabs}
        id='tabs'
      >
        {
          coinSortList.map(item => (
            <Radio.Button
              key={item.coin.id}
              value={Number(item.coin.id)}
              coinName={item.coin.name.toUpperCase()}
              className={`${style.tabs_but} tabs_but_item`}
            >{item.coin.name ? `${item.coin.name.toUpperCase()}计价` : ''}</Radio.Button>
          ))
        }
      </Radio.Group>
    )
  }
}

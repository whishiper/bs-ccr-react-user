import React, { Component } from 'react'
import { Icon, Row, Button } from 'antd';
import Tabs from './components/Tabs'
import style from './inde.less'


class TradeTabs extends Component {


  render() {

    const { hadleTabsChange, coinSortList, tabsActive } = this.props

    return (
      <Row type='flex' justify='space-between' align='middle' style={{padding: '20px 0'}}>

        <Button
          type="link"
          className={style.left_icon}
        >
          <Icon
            type="caret-left"
            theme="filled"
            style={{ fontSize: '25px' }}
          />
        </Button>
        <div className={style.main} id='main'>
          <Tabs coinSortList={coinSortList} tabsActive={tabsActive} hadleTabsChange={hadleTabsChange} />
        </div>
        <Button
          type="link"
          className={style.right_icon}
        >
          <Icon
            type="caret-right"
            theme="filled"
            style={{ fontSize: '25px' }}
          />
        </Button>

      </Row>
    )
  }
}

export default TradeTabs
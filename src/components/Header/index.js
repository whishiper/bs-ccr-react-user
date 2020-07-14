import React, { Component } from 'react'
import { Layout, Icon } from 'antd';
import NavRight from 'components/NavRight'
import style from './index.less';
const { Header } = Layout;

export default class CCRHeader extends Component {
  render() {
    const { collapsed, toggle } = this.props;
    return (
      <Header style={{ background: '#fff', padding: 0 }} className={style.header}>
        <Icon
          className={style.trigger}
          type={!collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={toggle}
        />
        <div className={style.nav_right}>
          <NavRight />
        </div>
      </Header>
    )
  }
}

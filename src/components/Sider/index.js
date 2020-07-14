import React, { Component } from 'react'
import Media from 'react-media';
import PCSider from 'components/pc/PCSider'
import MobileSider from 'components/mobile/MobileSider'

export default class CCRSider extends Component {
  render() {
    const {
      onMenuClick,
      collapsed,
      toggle,
      selectedKeyArr,
      menus,
    } = this.props
    return (
      <>
        <Media query="(max-width: 768px)" render={() =>
          (
            <MobileSider
              onMenuClick={onMenuClick}
              collapsed={collapsed}
              toggle={toggle}
              selectedKeys={[selectedKeyArr.join('/')]}
              menus={menus} />
          )}
        />
        <Media query="(min-width: 769px)" render={() =>
          (
            <PCSider
              onMenuClick={onMenuClick}
              collapsed={collapsed}
              selectedKeys={[selectedKeyArr.join('/')]}
              menus={menus} />
          )}
        />
      </>
    )
  }
}

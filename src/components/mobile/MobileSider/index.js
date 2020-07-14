import React from 'react';
import { Layout, Menu, Icon } from 'antd';
// import NewMenu from 'components/NewMenu';
import style from './index.less'

const { Sider } = Layout;
const { SubMenu } = Menu;
const Mobile_Sider = ({
  collapsed,
  selectedKeys,
  menus,
  onMenuClick,
  toggle
}) => {
  return (
    <div className={style.content}>
      <div
        className={collapsed ? style.sider_modal : ''}
        onClick={toggle}
      ></div>
      <Sider
        className={style.mobile_sider}
        style={{ height: '100%' }}
        trigger={null}
        collapsible
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={broken => {
          console.log(broken);
        }}
        collapsed={!collapsed}
        width={256}
      >
        <Menu
          theme="dark"
          mode="inline"
          onClick={onMenuClick}
          selectedKeys={selectedKeys}
        >
          {menus.map(item => {
            return (
              <SubMenu
                key={item.pathname}
                title={
                  <span>
                    {item.icon ? <Icon type={item.icon} /> : null}
                    <span>{item.title}</span>
                  </span>}
              >
                {
                  item.childrens
                    ?
                    item.childrens.map(childrenItem => {
                      return (
                        <Menu.Item key={childrenItem.pathname} onClick={toggle}>
                          {childrenItem.icon ? <Icon type={childrenItem.icon} /> : null}
                          {childrenItem.title}
                        </Menu.Item>
                      )
                    })
                    :
                    null
                }
              </SubMenu>
            )
          })}
        </Menu>
      </Sider>
    </div >
  )
}

export default Mobile_Sider;
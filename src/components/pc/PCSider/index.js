import React, { Fragment } from 'react';
import { Layout, Icon, Menu } from 'antd';

const { Sider } = Layout;
const { SubMenu } = Menu;

const PC_Sider = ({
  collapsed,
  selectedKeys,
  menus,
  onMenuClick
}) => {
  return (
    <Fragment>
      <Sider
        style={{ height: '100%' }}
        trigger={null}
        collapsible
        breakpoint="lg"
        collapsed={collapsed}
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
                    {item.icon ? <Icon type={item.icon} /> : ''}
                    <span>{item.title || ''}</span>
                  </span>
                }
              >
                {
                  item.childrens && item.childrens.map(childrenItem => {
                    return (
                      <Menu.Item key={childrenItem.pathname}>
                        {childrenItem.icon ? <Icon type={childrenItem.icon} /> : ''}
                        {childrenItem.title || ''}
                      </Menu.Item>
                    )
                  })
                }
              </SubMenu>
            )
          })}
        </Menu>
      </Sider>
    </Fragment>
  )
}
export default PC_Sider;
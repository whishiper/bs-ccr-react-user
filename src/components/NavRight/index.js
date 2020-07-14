import React from "react";
import { connect } from "dva";
import { Menu, Dropdown, Avatar, Icon } from "antd";
import { Link } from "dva/router";

const NavRight = ({ login, dispatch }) => {
  const loginout = () => {
    dispatch({ type: "login/loginout" });
  };
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo")) || {};
  const { username } = userInfo;

  const menu = (
    <Menu style={{ marginTop: '10px'}}>
      <Menu.Item key="1">
        <Link to="/ccr/settings">
          <Icon type="setting" style={{ paddingRight: '10px'}} />
          账号设置
        </Link>
      </Menu.Item>
      <Menu.Item key="2" disabled>
        <Icon type="user" />
        个人中心
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="3"
        onClick={() => {
          loginout();
        }}
      >
        <Icon type="logout" />
        退出登陆
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <a>
        <Avatar size="user" src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png" />
        <span style={{ paddingLeft: "10px" }}>{username || ""}</span>
      </a>
    </Dropdown>
  );
};

export default connect(({ login }) => ({
  login
}))(NavRight);

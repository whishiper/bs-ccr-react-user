import React, { Component } from "react";
import { connect } from "dva";
import { Link } from "dva/router";
import { Icon, Form, Button, Input, Tabs } from "antd";
import style from "./index.less";

const FormItem = Form.Item;
const { TabPane } = Tabs;

@connect(({ login }) => ({ login }))
@Form.create()

class Login extends Component {
  constructor(props) {
    super(props);
    this.state={}
  }

  render() {
    const { dispatch, form, login } = this.props;
    const { activeKey, iconLoading } = login;
    const { getFieldDecorator } = form;

    const handleTabsChange = key => {
      dispatch({ type: "login/updateState", payload: { activeKey: key } });
    };

    const handleLoginSubmit = e => {
      e.preventDefault();
      form.validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: "login/handleLoginSubmit",
            payload: { values, form }
          });
        }
      });
    };

    const account = () => {
      return (
        <div>
          <FormItem>
            {getFieldDecorator("tel", {
              rules: [
                { required: true, message: "请输入手机号码!" }
              ]
            })(
              <Input
                prefix={
                  <Icon type="phone" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="输入手机号"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator("password", {
              rules: [
                { required: true, message: "请输入密码!" }
              ]
            })(
              <Input.Password
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="输入密码"
              />
            )}
          </FormItem>
        </div>
      );
    };

    return (
      <div className={style.warpper}>
        <Form className={style.login_form} onSubmit={handleLoginSubmit}>
          <Tabs
            defaultActiveKey="account"
            activeKey={activeKey}
            onChange={handleTabsChange}
          >
            <TabPane tab="账号密码登陆" key="account">
              {activeKey === "account" ? account() : ""}
            </TabPane>
          </Tabs>
          <FormItem>
            <Button type="primary" htmlType="submit" block loading={iconLoading}>
              登陆
            </Button>
          </FormItem>
          <FormItem className={style.other}>
            <span>
              <Link to="/forget"> 忘记密码 </Link>
            </span>
            <span className={style.register}>
              <Link to="/register"> 注册账号 </Link>
            </span>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Login;

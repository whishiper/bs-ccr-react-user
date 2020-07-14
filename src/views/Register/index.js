import React, { Component } from "react";
import { connect } from "dva";
import { Link } from "dva/router";
import { Form, Input, Row, Button, Icon, message } from "antd";
import SendCodeItem from "components/SendCodeItem";
import style from "./index.less";

@connect(({ register }) => ({ register }))
@Form.create()
class Register extends Component {
  state = {
    help: "",
    visible: ""
  };

  //短信验证
  sendCode = () => {
    const { dispatch } = this.props;
    const { getFieldValue } = this.props.form;

    dispatch({
      type: "register/registerCode",
      payload: { tel: getFieldValue("tel") }
    });
  };

  render() {
    const { dispatch, form, register } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { iconLoading } = register;

    const isPhone = (_, value, callback) => {
      const myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
      if (value && !myreg.test(value) && typeof value !== "number") {
        callback("请输入正确的手机号码");
      }

      callback();
    };

    const handleLoginSubmit = e => {
      e.preventDefault();

      form.validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: "register/handleLoginSubmit",
            payload: { values, form }
          });
        }
      });
    };

    //密码
    const checkPassword = (_, value, callback) => {
      const { visible, confirmDirty } = this.state;
      if (!value) {
        this.setState({
          help: "",
          visible: !!value
        });
      } else {
        this.setState({
          help: ""
        });
        if (!visible) {
          this.setState({
            visible: !!value
          });
        }
        if (value.length < 6) {
          callback("密码不能小于6位");
        } else {
          const { form } = this.props;
          if (value && confirmDirty) {
            form.validateFields(["confirm"], { force: true });
          }
          callback();
        }
      }
      callback();
    };

    // 确认密码
    const checkConfirm = (_, value, callback) => {
      const { form } = this.props;
      if (value && value !== form.getFieldValue("password")) {
        callback("两次密码不一致");
      }
      callback();
    };

    return (
      <div className={style.center}>
        <Form className={style.centered} onSubmit={handleLoginSubmit}>
          <h3>注册</h3>
          <Form.Item hasFeedback>
            {getFieldDecorator("username", {
              rules: [
                {
                  required: true,
                  message: "请输入用户名!"
                }
              ]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="textarea"
                placeholder="输入用户名"
              />
            )}
          </Form.Item>
          <Form.Item hasFeedback>
            {getFieldDecorator("tel", {
              rules: [
                {
                  required: true,
                  message: "请输入手机号!"
                },
                {
                  validator: isPhone
                }
              ]
            })(
              <Input
                prefix={
                  <Icon type="phone" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="手机号码"
              />
            )}
          </Form.Item>
          <Form.Item hasFeedback>
            {getFieldDecorator("password", {
              rules: [
                {
                  required: true,
                  message: "请输入密码!"
                },
                {
                  validator: checkPassword
                }
              ]
            })(
              <Input.Password
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="至少6位密码，区分大小写"
              />
            )}
          </Form.Item>
          <Form.Item hasFeedback>
            {getFieldDecorator("lastpassword", {
              rules: [
                {
                  required: true,
                  message: "请输入确认密码!"
                },
                {
                  validator: checkConfirm
                }
              ]
            })(
              <Input.Password
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="确认密码"
              />
            )}
          </Form.Item>

          <SendCodeItem
            form={form}
            sendCode={this.sendCode}
            tel={getFieldValue("tel")}
            username={getFieldValue("username")}
            password={getFieldValue("password")}
            lastpassword={getFieldValue("lastpassword")}
          />

          <Form.Item>
            <Row className={style.form_item}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={iconLoading}
              >
                注册
              </Button>
            </Row>
          </Form.Item>

          <Form.Item className={style.form_item}>
            <Link to="/login">使用已有账户登录</Link>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Register;

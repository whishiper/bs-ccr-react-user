import React, { Component } from "react";
import { Form, Input, Row, Col, Button, message } from "antd";

class SendCodeItem extends Component {
  state = {
    help: "",
    visible: "",
    loading: false,
    timer: 59
  };

  //倒计60s
  count = () => {
    let { timer } = this.state;

    this.setState({
      loading: true,
      timer: timer--
    });

    let siv = setInterval(() => {
      this.setState({ timer: timer-- }, () => {
        if (timer <= -1) {
          clearInterval(siv);
          this.setState({ loading: false, timer: 59 });
        }
      });
    }, 1000);
  };

  componentWillUnmount = () => {
    this.setState = (state, callback) => {
      return;
    };
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { sendCode, tel = "" } = this.props;

    const new_sendCode = () => {
      if (this.state.timer === 59) {
        const myreg = /^[1][3,4,5,7,8][0-9]{9}$/;

        if (
          Reflect.has(this.props, "username") &&
          (this.props.username === "" || this.props.username === undefined)
        ) {
          message.warning("请输入用户名!");
          return;
        }

        if (!tel) {
          message.warning("手机号码不能为空！");
          return;
        }

        if (
          Reflect.has(this.props, "password") &&
          (this.props.password === "" ||
            this.props.password < 6 ||
            this.props.password === undefined)
        ) {
          message.warning("请输入正确的密码!");
          return;
        }

        if (
          Reflect.has(this.props, "lastpassword") &&
          (this.props.lastpassword === "" ||
            this.props.lastpassword !== this.props.password ||
            this.props.lastpassword === undefined)
        ) {
          message.warning("请输入正确的确认密码!");
          return;
        }

        if (!myreg.test(tel)) {
          message.warning("请输入正确的手机号码！");
          return;
        }


        this.count();

        sendCode();
        return;
      }
    };
    return (
      <Form.Item>
        <Row type="flex" justify="space-between" align="middle">
          <Col style={{ width: "calc(95% - 110px)" }}>
            {getFieldDecorator("code", {
              rules: [
                {
                  required: true,
                  message: "请输入验证码!"
                }
              ]
            })(<Input placeholder="验证码" />)}
          </Col>
          <Button
            onClick={() => {
              new_sendCode();
            }}
            style={{ marginLeft: "10px", width: "100px" }}
            type="primary"
          >
            {this.state.loading ? this.state.timer + "秒后重发" : "发送验证"}
          </Button>
        </Row>
      </Form.Item>
    );
  }
}

export default SendCodeItem;

import React, { Component } from "react";
import {
  Modal,
  Input,
  Form,
  Row,
  Col,
  Button,
  message,
  Steps,
  Icon
} from "antd";
import { connect } from "dva";
import { oldTelValidateCode, updateTel } from "services/app";
const { Step } = Steps;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 14, offset: 1 }
};
@Form.create()
@connect(({ accountSet }) => ({ accountSet }))
class PhoneNumberModel extends Component {
  state = {
    current: 0,
    loading: false,
    new_loading: false,
    timer: 59,
    new_timer: 59,
    complete_timer: 3
  };

  //倒计60s
  count = () => {
    let { timer } = this.state;
    let siv = setInterval(() => {
      this.setState({ timer: timer-- }, () => {
        if (timer <= -1) {
          clearInterval(siv);
          this.setState({ loading: false, timer: 59 });
        }
      });
    }, 1000);
  };

  new_count = () => {
    let { new_timer } = this.state;
    let new_siv = setInterval(() => {
      this.setState({ new_timer: new_timer-- }, () => {
        if (new_timer <= -1) {
          clearInterval(new_siv);
          this.setState({ new_loading: false, new_timer: 59 });
        }
      });
    }, 1000);
  };

  // 验证码
  PhoneCode = e => {
    const { dispatch } = this.props;
    const { getFieldValue } = this.props.form;
    console.log("1234");

    if (this.state.timer === 59) {
      console.log("12");

      const myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
      const tel = getFieldValue("tel");
      if (!tel) {
        message.warning("手机号码不能为空！");
        return;
      }

      if (!myreg.test(tel)) {
        message.warning("请输入正确的手机号码！");
        return;
      }
    }

    this.setState({ loading: true });
    this.count();

    console.log("00000");
    dispatch({
      type: "accountSet/PhoneCode",
      payload: { tel: getFieldValue("tel") }
    });
  };

  new_PhoneCode = e => {
    const { dispatch } = this.props;
    const { getFieldValue } = this.props.form;

    if (this.state.timer === 59) {
      const myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
      const new_tel = getFieldValue("new_tel");
      console.log("1234");
      if (!new_tel) {
        message.warning("手机号码不能为空！");
        return;
      }

      if (!myreg.test(new_tel)) {
        message.warning("请输入正确的手机号码！");
        return;
      }
    }

    this.setState({ new_loading: true });
    this.new_count();

    dispatch({
      type: "accountSet/new_PhoneCode",
      payload: {
        tel: getFieldValue("new_tel")
      }
    });
    return;
  };
  //上一步
  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  render() {
    const { props } = this;
    const {
      changePasswordModelVisible,
      handleCancel,
    } = props;
    const { getFieldDecorator, getFieldValue } = props.form;
    const { current } = this.state;

    const isPhone = (_, value, callback) => {
      const myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
      if (value && !myreg.test(value) && typeof value !== "number") {
        callback("请输入正确的手机号码");
      }

      callback();
    };
    const telPhone = (_, value, callback) => {
      const myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
      if (value && !myreg.test(value) && typeof value !== "number") {
        callback("请输入正确的手机号码");
      }

      callback();
    };

    const next = async (_, value, callback) => {
      const myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
      const tel = getFieldValue("tel");
      const new_tel = getFieldValue("new_tel");

      console.log("222222");

      if (this.state.current === 0) {
        console.log("33333");
        try {
          if (!myreg.test(tel)) {
            message.warning("手机号码不能为空！");
            return;
          }
          const data = await oldTelValidateCode({
            tel,
            code: getFieldValue("code")
          });
          console.log(data);
          if (
            !(
              typeof data === "object" && Reflect.get(data, "msg") === "success"
            )
          ) {
            message.error(data.msg);
            return;
          }
          const current = this.state.current + 1;
          this.setState({ current });
          return;
        } catch (e) {
          let error = "验证码不正确";

          message.error(error);
          return;
        }
      }

      if (this.state.current === 1) {
        try {
          if (!myreg.test(new_tel)) {
            message.warning("新手机号码不能为空！");
            return;
          }
          const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
          console.log(userInfo);
          const params = {
            id: String(userInfo.id),
            tel: getFieldValue("new_tel"),
            code: getFieldValue("new_code")
          };

          const data = await updateTel(params);

          if (
            !(
              typeof data === "object" &&
              Reflect.has(data, "msg") &&
              Reflect.get(data, "msg") === "success"
            )
          ) {
            message.error(data.msg);
            return;
          }
          message.success("更换手机成功!");
          const current = this.state.current + 1;
          this.setState({ current });
        } catch (e) {
          let error = "更换手机失败!";

          if (typeof err === "object" && Reflect.has(e, "errors")) {
            error = e.errors;
          }

          message.error(error);
          return;
        }
      }

      if (this.state.current === 2) {
        let { complete_timer } = this.state;
        console.log(complete_timer, 333333);
        let complete_siv = setInterval(() => {
          console.log(complete_siv, 4444);

          this.setState({ complete_timer: complete_timer-- }, () => {
            if (complete_timer <= -1) {
              clearInterval(complete_siv);
              this.setState({ loading: false, complete_timer: 3 });
              window.location.href = "/";
            }
          });
        }, 1000);
      }
    };

    // 更换手机步骤
    const steps = [
      {
        title: "验证手机",
        content: (
          <Form style={{ marginTop: '30px', marginBottom: '30px' }}>
            <FormItem {...formItemLayout} label="旧手机号码">
              {getFieldDecorator("tel", {
                rules: [
                  {
                    required: true,
                    message: "请输入旧手机号码"
                  },
                  {
                    validator: telPhone
                  }
                ]
              })(<Input type="phone" placeholder="请输入旧手机号码" />)}
            </FormItem>
            <FormItem style={{ marginLeft: "25%" }}>
              <Row type="flex" justify="start" align="middle">
                <Col style={{ width: "calc(95% - 170px)" }}>
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
                  style={{ width: "100px", marginLeft: "15px" }}
                  type="primary"
                  onClick={this.PhoneCode}
                >
                  {this.state.loading
                    ? this.state.timer + "秒后重发"
                    : "发送验证"}
                </Button>
              </Row>
            </FormItem>
          </Form>
        )
      },
      {
        title: "更换绑定手机",
        content: (
          <Form style={{ marginTop: '30px', marginBottom: '30px' }}>
            <FormItem {...formItemLayout} label="新手机号码">
              {getFieldDecorator("new_tel", {
                rules: [
                  {
                    required: true,
                    message: "请输入新手机号码"
                  },
                  {
                    validator: isPhone
                  }
                ]
              })(<Input type="phone" placeholder="请输入新手机号码" />)}
            </FormItem>
            <FormItem style={{ marginLeft: "25%" }}>
              <Row type="flex" justify="start" align="middle">
                <Col style={{ width: "calc(95% - 170px)" }}>
                  {getFieldDecorator("new_code", {
                    rules: [
                      {
                        required: true,
                        message: "请输入验证码!"
                      }
                    ]
                  })(<Input placeholder="验证码" />)}
                </Col>
                <Button
                  style={{ width: "100px", marginLeft: "15px" }}
                  type="primary"
                  onClick={this.new_PhoneCode}
                >
                  {this.state.new_loading
                    ? this.state.new_timer + "秒后重发"
                    : "发送验证"}
                </Button>
              </Row>
            </FormItem>
          </Form>
        )
      },
      {
        title: "完成",
        content: (
          <div style={{ textAlign: "center", marginTop: '30px', marginBottom: '30px' }}>
            <Icon type="check-circle" style={{ color: "green" }} />
            {this.state.complete_timer + "秒后跳转首页"}
          </div>
        )
      }
    ];

    return (
      <div>
        <Modal
          title="更换手机号码"
          visible={changePasswordModelVisible}
          // onOk={newHandleOk}
          onCancel={handleCancel}
          maskClosable={false}
          footer={null}
        >
          <div>
            <Steps current={current}>
              {steps.map(item => (
                <Step key={item.title} title={item.title} />
              ))}
            </Steps>
            <div className="steps-content">{steps[current].content}</div>
            <div className="steps-action">
              {current < steps.length - 1 && (
                <Button type="primary" onClick={next}>
                  下一步
                </Button>
              )}
              {current === steps.length - 1 && (
                <Button
                  type="primary"
                  onClick={() => window.location.href = "/"}
                >
                  首页
                </Button>
              )}
              {current > 0 && (
                <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                  上一步
                </Button>
              )}
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default PhoneNumberModel;

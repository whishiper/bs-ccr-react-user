import React, { Component } from "react";
import { Modal, Input, Form, Button, Row, Col, message } from "antd";
import { connect } from "dva";

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 14, offset: 1 }
};
@Form.create()
@connect(({ accountSet }) => ({ accountSet }))
class ChangePasswordModel extends Component {
  state = { help: "", visible: "" };
  render() {
    const { props } = this;
    const {
      dispatch,
      form,
      changePasswordModelVisible,
      handleOk,
      handleCancel,
      accountSet
    } = props;
    const { getFieldDecorator, getFieldValue } = props.form;
    const { passwordCodeButText } = accountSet;

    const newHandleOk = () => {
      form.validateFields((err, values) => {
        if (!err) {
          handleOk({ values, form });
        }
      });
    };

    const checkPassword = (rule, value, callback) => {
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
    const checkConfirm = (rule, value, callback) => {
      const { form } = this.props;

      if (value && value !== form.getFieldValue("password")) {
        callback("两次密码不一致");
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

    // 验证码
    const PasswordCode = () => {
      if (passwordCodeButText !== "获取验证码") {
        return;
      }

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

      dispatch({
        type: "accountSet/PasswordCode",
        payload: { tel }
      });
    };

    return (
      <div>
        <Modal
          title="修改密码"
          visible={changePasswordModelVisible}
          onOk={newHandleOk}
          onCancel={handleCancel}
          maskClosable={false}
        >
          <Form>
            <FormItem {...formItemLayout} label="手机号码">
              {getFieldDecorator("tel", {
                rules: [
                  {
                    required: true,
                    message: "请输入账号绑定手机号码"
                  },
                  {
                    validator: telPhone
                  }
                ]
              })(<Input type="phone" placeholder="请输入账号绑定手机号码" />)}
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
                  onClick={PasswordCode}
                >
                  {passwordCodeButText}
                </Button>
              </Row>
            </FormItem>
            <FormItem {...formItemLayout} label="新密码">
              {getFieldDecorator("password", {
                rules: [
                  {
                    required: true,
                    message: "请输入新密码！"
                  },
                  {
                    validator: checkPassword
                  }
                ]
              })(<Input.Password placeholder="至少6位新密码，区分大小写" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="确认新密码">
              {getFieldDecorator("lastpassword", {
                rules: [
                  {
                    required: true,
                    message: "请输入确认新密码！"
                  },
                  {
                    validator: checkConfirm
                  }
                ]
              })(<Input.Password placeholder="确认新密码" />)}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default ChangePasswordModel;

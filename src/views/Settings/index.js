import React, { Component } from "react";
import { Row, Col, Input, Form, Button } from "antd";
// import { routerRedux } from "dva/router";
import { connect } from "dva";
import BindGoogleModal from "./components/BindGoogleModal";
import ChangePasswordModel from "./components/ChangePasswordModel";
import PhoneNumberModel from "./components/PhoneNumberModel";
import styles from "./index.less";

const FormItem = Form.Item;
const { Password } = Input;

@Form.create()
@connect(({ accountSet }) => ({ accountSet }))
class AccountSet extends Component {

  render() {
    const { dispatch, accountSet, form } = this.props;

    console.log(accountSet)
    const {
      bindGoogleModalVisible,
      changePasswordModelVisible,
      phoneNumberModelVisible,
      formData,
      phoneInputShow,
      passwordInputShow,
      formPassword
    } = accountSet;

    const userInfo = JSON.parse(sessionStorage.getItem("userInfo")) || {};
    const { isBinding } = userInfo;

    const { getFieldDecorator } = form;

    const handleModifyPhone = () => {
      dispatch({
        type: "accountSet/handleModifyPhone"
      });
    };

    const handleKeepPhone = e => {
      console.log(e, "======");
      dispatch({
        type: "accountSet/handleKeepPhone",
        payload: e
      });
    };
    // 手机号码修改
    const phoneNumberModelCancel = values => {
      dispatch({
        type: "accountSet/updateState",
        payload: {
          phoneNumberModelVisible: false
        }
      });
    };

    const handleModifyPassword = () => {
      dispatch({
        type: "accountSet/handleModifyPassword"
      });
    };

    const handleKeepPassword = e => {
      console.log(e);
      dispatch({
        type: "accountSet/handleKeepPassword",
        payload: e
      });
    };

    // 修改密码弹框, hlh
    const handleChangePasswordModelCancel = values => {
      dispatch({
        type: "accountSet/updateState",
        payload: {
          values,
          changePasswordModelVisible: false
        }
      });
    };

    //  *******************
    const handleBindGoogleModalShow = () => {
      dispatch({ type: "accountSet/handleBindGoogleModalShow" });
    };

    const handleBindGoogleModalOk = value => {
      dispatch({
        type: "accountSet/handleBindGoogleModalOk",
        payload: value
      });
    };

    const handleBindGoogleModalCancel = () => {

      dispatch({
        type: "accountSet/updateState",
        payload: {
          bindGoogleModalVisible: false
        }
      });
    };

    return (
      <div className={styles.container}>
        <h2>账号设置</h2>
        <div className={styles.main}>
          <Form>
            <Row
              type="flex"
              justify="space-between"
              align="middle"
              className={styles.crr_row}
            >
              <Col className={styles.crr_row_name} span={20}>
                <span style={{ paddingRight: "20px" }}>更换手机号码</span>
              </Col>

              <Col
                style={{
                  display: !phoneInputShow ? "block" : "none",
                  color: "#268fff"
                }}
                span={4}
                className={styles.but}
                onClick={() => {
                  handleModifyPhone();
                }}
              >
                更换
              </Col>
            </Row>
            <Row
              type="flex"
              justify="space-between"
              align="middle"
              className={styles.crr_row}
            >
              <Col span={20} className={styles.crr_row_name}>
                <span style={{ paddingRight: "20px" }}>修改密码</span>
                {passwordInputShow ? (
                  <span
                    span={14}
                    style={{ marginBottom: "-24px", display: "inline-block" }}
                  >
                    <FormItem style={{ width: "200px" }}>
                      {getFieldDecorator("password", {
                        initialValue: formData.password,
                        rules: [
                          {
                            required: true,
                            message: "密码不能为空."
                          }
                        ]
                      })(<Password placeholder="请输入更改密码" />)}
                    </FormItem>
                  </span>
                ) : (
                  ""
                )}
              </Col>
              <Col
                style={{
                  display: !passwordInputShow ? "block" : "none",
                  color: "#268fff"
                }}
                span={4}
                className={styles.but}
                onClick={() => {
                  handleModifyPassword();
                }}
              >
                修改
              </Col>
            </Row>
            <Row
              type="flex"
              justify="space-between"
              align="middle"
              className={styles.crr_row}
            >
              <Col className={styles.crr_row_name} span={20}>
                <span style={{ paddingRight: "20px" }}>谷歌身份验证</span>
                <span style={{ fontSize: "12px", color: "#cfcfcf" }}>
                  更换手机或解绑联系客服
                </span>
              </Col>
              <Col style={{ color: "#268fff" }} span={4} className={styles.but}>
                <Button
                  type="link"
                  style={{ width: "100%", letterSpacing: '-2px' }}
                  onClick={() => {
                    handleBindGoogleModalShow();
                  }}
                  disabled={Number(isBinding) === 1 ? true : false}
                >
                  绑定
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
        <BindGoogleModal
          bindGoogleModalVisible={bindGoogleModalVisible}
          handleOk={handleBindGoogleModalOk}
          handleCancel={handleBindGoogleModalCancel}
        />
        <ChangePasswordModel
          changePasswordModelVisible={changePasswordModelVisible}
          handleOk={handleKeepPassword}
          formPassword={formPassword}
          handleCancel={handleChangePasswordModelCancel}
        />
        <PhoneNumberModel
          changePasswordModelVisible={phoneNumberModelVisible}
          handleOk={handleKeepPhone}
          handleCancel={phoneNumberModelCancel}
        />
      </div>
    );
  }
}

export default AccountSet;

import React, { Component } from "react";
import { Input, Form, Modal, Row, Col, Spin } from "antd";
import { connect } from "dva";
import styles from "./BindGoogleModal.less";

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 14, offset: 1 }
};

@Form.create()
@connect(({ accountSet }) => ({ accountSet }))
class BindGoogleModal extends Component {
  render() {
    const { props } = this;
    const {
      form,
      bindGoogleModalVisible,
      handleOk,
      handleCancel,
      accountSet
    } = props;
    const { secret, codeUrl, loading } = accountSet;
    const { getFieldDecorator } = props.form;

    const newHandleOk = () => {
      form.validateFields((err, values) => {
        if (!err) {
          handleOk({ values, form });
        }
      });
    };

    return (
      <Modal
        maskClosable={false}
        title="绑定谷歌验证"
        visible={bindGoogleModalVisible}
        onOk={newHandleOk}
        onCancel={handleCancel}
        okText="绑定"
      >
        <Spin tip="Loading..." size="small" spinning={loading}>
          <Row
            className={styles.crr_secret_key}
            type="flex"
            justify="space-between"
            align="middle"
          >
            <Col span={5} className={styles.crr_secret_key_text}>
              秘钥
          </Col>
            <Col span={18} offset={1}>
              {secret}
            </Col>
          </Row>
          <Row type="flex" justify="space-between" align="middle">
            <Col span={18} offset={6} style={{ height: '150px' }}>
              <img className={styles.ccr_code_img} src={`data:image/jpeg;base64,${codeUrl}`} alt="验证码" />
            </Col>
          </Row>
          <Row
            type="flex"
            justify="space-between"
            align="middle"
            style={{ padding: "24px 0" }}
          >
            <Col span={18} offset={6}>
              请使用谷歌验证器输入密钥或扫描二维码，以进行绑定，请妥善保管密钥和二维码，请勿告知他人
          </Col>
          </Row>
          <Form>
            <FormItem {...formItemLayout} label="谷歌验证码">
              {getFieldDecorator("code", {
                rules: [
                  {
                    required: true,
                    message: "请输入验证码."
                  }
                ]
              })(<Input placeholder="请输入验证码" />)}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    );
  }
}

export default BindGoogleModal;

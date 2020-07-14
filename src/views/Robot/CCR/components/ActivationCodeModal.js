import React, { Component } from 'react';
import { connect } from "dva";
import { Modal, Form, Input, Button } from 'antd';
import styles from './activationCodeModal.less'

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 4 },
    sm: { span: 4 },
    md: { span: 4 },
    lg: { span: 4 },
    xl: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 18 },
    md: { span: 18 },
    lg: { span: 18 },
    xl: { span: 18 }
  }
};

@Form.create()

@connect(({ ccr }) => ({ ccr }))

class ActivationCodeModal extends Component {

  handleSubmit = e => {
    const { form, dispatch } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'ccr/handleActiveCode',
          payload: {
            form,
            values
          }
        })
      }
    });
  };

  render() {
    const { props } = this;
    const { ccr, dispatch, form } = props;
    const { getFieldDecorator } = form;
    const { activationVisible } = ccr;

    const handleCancel = () => {
      dispatch({
        type: 'ccr/updateState', payload: {
          activationVisible: false,
        }
      })
    }

    return (
      <Modal
        title='激活'
        visible={activationVisible}
        onCancel={handleCancel}
        footer={null}
        centered={true}
        maskClosable={false}
      >
        <Form onSubmit={this.handleSubmit} >
          <FormItem
            {...formItemLayout}
            label="激活码"
          >
            {getFieldDecorator("key", {
              rules: [
                {
                  required: true,
                  message: "请输入激活码！"
                },
              ],
            })(
              <Input placeholder='请输入激活码！' />
            )}
          </FormItem>
          <FormItem
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 18, offset: 4 },
            }}
          >
            <Button type="primary" block htmlType="submit" >激活 </Button>
            <span className={styles.tips}>激活后会立即开始计算时长</span>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default ActivationCodeModal;

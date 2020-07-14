import React, { Component } from "react";
import { Input, Form, Modal, Radio, Icon, Tooltip, Spin } from "antd";

const FormItem = Form.Item;
const InputPassword = Input.Password;

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
    md: { span: 6 },
    lg: { span: 6 },
    xl: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 15 },
    sm: { span: 15 },
    md: { span: 15 },
    lg: { span: 15 },
    xl: { span: 15 }
  }
};
@Form.create({
  mapPropsToFields(props) {
    const { formData } = props;
    const {
      accessKey,
      secretKey,
      tradePlatformId,
      nickname
    } = formData;
    return {
      tradePlatformId: Form.createFormField({
        value: tradePlatformId
      }),
      accessKey: Form.createFormField({
        value: accessKey
      }),
      secretKey: Form.createFormField({
        value: secretKey
      }),
      nickname: Form.createFormField({
        value: nickname
      })
    };
  }
})

class FormModal extends Component {

  render() {
    const { props } = this;
    const { form, visible, handleOk, handleCancel, formType, tradePlatList, loading, tradeName, dispatch, formData } = props;
    const { getFieldDecorator } = form;

    const newHandleOk = () => {
      form.validateFields((err, values) => {
        if (!err) {
          handleOk({ values, form })
        }
      });
    };

    const handleClick = (value) => {
      const tradePlatItem = tradePlatList.find(item => Number(value) === Number(item.id)) || {}
      const { name = 'huobi' } = tradePlatItem

      dispatch({
        type: 'api/updateState', payload: {
          tradeName: name, formData: Object.assign(formData, { tradePlatformId: value })
        }
      })
      console.log('12211212121212')

    }


    const newHandleCancel = () => {
      handleCancel({ form });
    };

    const isPhone = (_, value, callback) => {

      const myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;

      if (value && !myreg.test(value) && typeof value !== "number") {
        callback("请输入正确的手机号码");
      }

      callback();
    };

    return (
      <Modal
        title={`${formType === "add" ? "添加" : "编辑"}交易平台账号`}
        visible={visible}
        onOk={newHandleOk}
        onCancel={newHandleCancel}
        okText="提交"
        cancelText="取消"
        centered={true}
        maskClosable={false}
      >
        <Spin tip="Loading..." spinning={loading} delay="120">
          <Form>
            <FormItem {...formItemLayout} label="交易平台">
              {getFieldDecorator("tradePlatformId")(
                <Radio.Group name="radiogroup" >
                  {
                    tradePlatList.map(item => (
                      <Radio key={item.id} value={item.id} onClick={() => handleClick(item.id)}>{item.name}</Radio>
                    ))
                  }
                </Radio.Group>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="accessKey">
              {getFieldDecorator("accessKey", {
                rules: [{
                  required: true,
                  message: "请输入accessKey."
                }]
              })(<Input placeholder="请输入accessKey" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="secretKey">
              {getFieldDecorator("secretKey", {
                rules: [{
                  required: true,
                  message: "请输入secretKey."
                }]
              })(
                formType === "add"
                  ?
                  <InputPassword placeholder="请输入secretKey" />
                  :
                  <Input
                    placeholder="请输入secretKey"
                    suffix={
                      <Tooltip title="为了保障数据安全，已填的secretKey不宜明文展现，请重新填写secretKey！">
                        <Icon type="info-circle" style={{ color: 'rgba(255,0,0,.45)' }} />
                      </Tooltip>
                    }
                  />
              )}
            </FormItem>
            {
              tradeName === 'okex'
                ?
                <>
                  <FormItem {...formItemLayout} label="passphrase">
                    {getFieldDecorator("pass", {
                      rules: [{
                        required: true,
                        message: "请输入passphrase"
                      }]
                    }
                    )(<Input placeholder="请输入passphrase" />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="手机号码">
                    {getFieldDecorator("sign", {
                      rules: [{
                        required: true,
                        message: "请输入OK账户绑定的手机号码！"
                      }, {
                        validator: isPhone
                      }]
                    }
                    )(<Input placeholder="请输入OK账户绑定的手机号码！" />)}
                  </FormItem>
                </>
                :
                ''
            }


            <FormItem {...formItemLayout} label="别名">
              {getFieldDecorator("nickname", {
                rules: [{
                  required: true,
                  message: "请输入别名！"
                }]
              }
              )(<Input placeholder="请输入别名" />)}
            </FormItem>
            <div style={{ color: "red",padding:'0 30px'}}>
              {
                formType === "add"
                  ? "注意:每个帐号只能同时添加一个API , API过期或作废后，请编辑原有API"
                  : "注：若API不在同一帐号下，交易订单无法继承"
              }
            </div>
          </Form>
        </Spin>

      </Modal>
    );
  }
}

export default FormModal;

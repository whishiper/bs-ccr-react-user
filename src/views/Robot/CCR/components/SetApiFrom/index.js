import React, { Component } from "react";
import { Form, Select } from "antd";
import { connect } from "dva";
import './antd.less';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
@connect(({ ccr }) => ({ ccr }))

class SetApiFrom extends Component {

  render() {
    const { form, ccr, isShowUnbound, cardItem } = this.props;
    const { tradePlatformName, tradePlatformApiNickname } = cardItem

    const { apiList } = ccr;
    const { getFieldDecorator } = form;

    return (
      <Form style={{ width: '250px' }} className='set_api_form'>
        <FormItem
          className='set_api_form_item'
          label="设置API"
          help={`当前监控 ${tradePlatformName ? `${tradePlatformApiNickname} (${tradePlatformName}) ` : '还没有绑定api'}`}
        >
          {getFieldDecorator("apiId", {
            required: true,
            message: "请选择更换的API"
          })(
            <Select placeholder="请选择更换的API">
              {
                apiList.map(item => (<Option
                  disabled={Number(item.isBound) === 2}
                  key={item.id}
                  value={item.id}
                >{item.nickname} {`(${item.tradePlatform.name})`}</Option>))
              }
              {isShowUnbound ? <Option value="unbound">解除监控</Option> : ''}
            </Select>
          )}
        </FormItem>
      </Form>
    );
  }
}

export default SetApiFrom;

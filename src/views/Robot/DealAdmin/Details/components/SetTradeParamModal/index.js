import React, { Component } from "react";
import { connect } from 'dva';
import {
  Input,
  Form,
  Modal,
  Divider,
  Radio,
  Row,
  Col,
  Checkbox,
  Icon,
  Tooltip,
  InputNumber
} from "antd";
import style from "./index.less";


@connect(({ dealAdmin }) => ({ dealAdmin }))
@Form.create({
  mapPropsToFields(props) {
    const { dealParamsForm } = props
    if (JSON.stringify(dealParamsForm) !== '{}') {
      console.log(dealParamsForm, 'dealParamsForm')
      const { stopProfitType, stopProfitTraceTriggerRate, stopProfitTraceDropRate, stopProfitFixedRate, stopProfitMoney } = dealParamsForm
      return {
        stopProfitType: Form.createFormField({
          value: `${stopProfitType}`
        }),
        stopProfitTraceTriggerRate: Form.createFormField({
          value: stopProfitTraceTriggerRate
        }),
        stopProfitTraceDropRate: Form.createFormField({
          value: stopProfitTraceDropRate
        }),
        stopProfitFixedRate: Form.createFormField({
          value: stopProfitFixedRate
        }),
        stopProfitMoney: Form.createFormField({
          value: stopProfitMoney
        }),
      }
    }
  },
  onValuesChange(props, changedValues, allValues) {

    const { dealParamsForm, dispatch } = props
    dispatch({
      type: 'coinPairsDetails/updateState', payload: {
        tradeParamForm: Object.assign(dealParamsForm, changedValues)
      }
    })

  }
})

class SetTradeParamModal extends Component {

  handleCheckBox({ fromValue }) {
    const { dispatch } = this.props

    console.log(fromValue, '-----fromValue')
    const { checkboxProfitMoney, stopProfitMoney } = fromValue




    dispatch({
      type: 'coinPairsDetails/updateState', payload: {
        tradeParamForm: Object.assign(fromValue, {
          checkboxProfitMoney: !checkboxProfitMoney,
          stopProfitMoney: checkboxProfitMoney ? 0 : stopProfitMoney
        })
      }
    })

  }
  render() {
    const { props } = this;
    const { form, visible, handleOk, handleCancel, dealParamsForm, dealAdmin } = props;
    const { getFieldDecorator, getFieldValue } = props.form;
    const { activeItem } = dealAdmin
    const { name, real_time_earning_ratio,checkboxProfitMoney } = dealParamsForm;
    const newHandleOk = () => {
      form.validateFields((err, values) => {
        if (!err) {
          handleOk({ values, form });
        }
      });
    };

    const newHandleCancel = () => {
      handleCancel({ form });
    };
    return (
      <Modal
        title={`交易参数设置---${name ? name.toUpperCase() : ''}`}
        visible={visible}
        onOk={newHandleOk}
        onCancel={newHandleCancel}
        width={600}
        okText="提交"
        cancelText="取消"
        centered={true}
        maskClosable={false}
      >
        <Form>
          <Row>
            <Col span={6} style={{ textAlign: "center" }}>收益比:</Col>
            <Col span={18}>{real_time_earning_ratio || 0}</Col>
          </Row>
          <Divider />
          <Row className={style.target_profit_way}>
            <Col span={6} style={{ textAlign: "center", marginTop: '26px' }}>止盈方式:</Col>
            <Col span={18}>
              {getFieldDecorator("stopProfitType")(
                <Radio.Group>

                  <div className={style.row}>
                    <Radio value="1">追踪止盈</Radio>
                    <Row>
                      <Col style={{ marginTop: '26px' }}>
                        {getFieldDecorator("stopProfitTraceTriggerRate")(
                          <InputNumber
                            style={{ width: "70px" }}
                            disabled={Number(getFieldValue("stopProfitType")) !== 1}
                            formatter={value => `${value && !isNaN(value) ? value : ''}`}
                          />
                        )}
                        <span style={{ marginLeft: "10px" }}>%</span>
                      </Col>
                      <div className={style.tips}>触发比例</div>
                    </Row>
                    <Divider style={{ height: "40px", margin: "0 20px" }} type="vertical" />
                    <Row>
                      <Col style={{ marginTop: '26px' }}>
                        {getFieldDecorator("stopProfitTraceDropRate")(
                          <InputNumber formatter={value => `${value && !isNaN(value) ? value : ''}`}
                            style={{ width: "70px" }} disabled={Number(getFieldValue("stopProfitType")) !== 1} />
                        )}
                        <span style={{ marginLeft: "10px" }}>%</span>
                      </Col>
                      <div className={style.tips}>回降比例</div>
                    </Row>
                    <Tooltip placement="bottom" title={'当盈利达到触发比例时，开始追踪，待盈利增长达到最大，下跌量达到回降比例时止盈。'}>
                      <Icon type="question-circle" style={{ paddingLeft: '10px' }} />
                    </Tooltip>
                  </div>

                  <div className={style.row}>
                    <Radio value="2">固定止盈</Radio>
                    <Row>
                      <Col>
                        {getFieldDecorator("stopProfitFixedRate")(
                          <InputNumber formatter={value => `${value && !isNaN(value) ? value : ''}`} min={0} style={{ width: "70px" }} disabled={Number(getFieldValue("stopProfitType")) !== 2} />
                        )}
                        <span style={{ marginLeft: "10px" }}>%</span>
                      </Col>
                      <div className={style.tips}>止盈比例</div>
                    </Row>
                  </div>

                </Radio.Group>
              )}
            </Col>
          </Row>

          <Divider dashed />

          <Row type="flex" justify="space-around" align="middle">
            <Col span={18} offset={6}>
              <Row type="flex" justify="start" align="middle">
                <Checkbox onChange={() => { this.handleCheckBox({ fromValue: dealParamsForm }) }} checked={checkboxProfitMoney}>止盈金额</Checkbox>
                {getFieldDecorator("stopProfitMoney")(
                  <InputNumber
                    formatter={value => `${value && !isNaN(value) ? value : ''}`}
                    style={{ width: "80px", marginLeft: "10px" }}
                    disabled={!checkboxProfitMoney}
                  />
                )}
                <div style={{ marginLeft: "10px" }}>{activeItem && activeItem.coin ? activeItem.coin.name.toUpperCase() : ''}</div>
              </Row>
              <Row style={{ margin: "10px 0 0" }}>盈利达到设置金额则卖出止盈，勾选后会按百分比和金额间最先触发的条件止盈</Row>
            </Col>
          </Row>

        </Form>
      </Modal>
    );
  }
}

export default SetTradeParamModal;

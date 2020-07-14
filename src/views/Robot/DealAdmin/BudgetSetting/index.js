import React, { Component } from 'react'
import { connect } from 'dva';
import NewPageHeader from 'components/NewPageHeader/index';
import ListItem from './compontens/ListItem'
import { Form, Input, Button, Checkbox, Row, Col, Select, message, Spin } from 'antd';
import { getStrategyExplain } from 'services/app';
import { twoNumber, isNumber } from 'utils';
import style from './index.less'

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 4 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 12 },
  },
};


const handleMoneyChange = async (props, allValues) => {
  const { dispatch, setBudget } = props
  const { freeCoinPairList = [] } = setBudget
  const { money, strategyId } = allValues
  let lever = 0

  if (strategyId) {
    const data = await getStrategyExplain(strategyId)
    const is_true = typeof data === 'object' && Reflect.has(data, 'id')
    lever = is_true ? data.lever : 0

    if (is_true) {
      dispatch({
        type: 'setBudget/updateState', payload: {
          strategyExplain: data
        }
      })
    }

  }

  const is_checked_list = freeCoinPairList.filter(item => item.item_checked)
  const size = is_checked_list.length

  if (size !== 0) {

    const newFreeCoinPairList = freeCoinPairList.map(item => {
      if (item.item_checked) {
        item.item_money = money && size ? twoNumber(money / size) : 0
        item.item_lever = lever
      }
      return item
    })

    dispatch({
      type: 'setBudget/updateState', payload: {
        freeCoinPairList: newFreeCoinPairList,
        totalMoney: strategyId && money && lever ? money * lever : 0,
      }
    })
  }

}

const handleStrategyChange = async (props, allValues) => {

  const { money, strategyId } = allValues
  const { dispatch } = props
  let lever = 0

  if (strategyId) {
    const data = await getStrategyExplain(strategyId)
    console.log(data, '----data')
    const is_true = typeof data === 'object' && Reflect.has(data, 'id')
    lever = is_true ? data.lever : 0

    if (is_true) {
      dispatch({
        type: 'setBudget/updateState', payload: {
          strategyExplain: data
        }
      })
    }
  }

  const { setBudget } = props
  const { freeCoinPairList = [] } = setBudget

  const is_checked_list = freeCoinPairList.filter(item => item.item_checked)
  const size = is_checked_list.length

  if (size !== 0) {

    const newFreeCoinPairList = freeCoinPairList.map(item => {
      if (item.item_checked) {
        item.item_strategyId = strategyId
        item.item_lever = lever
      }
      return item
    })

    console.log(lever, '---lever')
    dispatch({
      type: 'setBudget/updateState', payload: {
        freeCoinPairList: newFreeCoinPairList,
        totalMoney: strategyId && money && lever ? money * lever : 0,
      }
    })
  }

}

@connect(({ setBudget }) => ({ setBudget }))

@Form.create({
  onValuesChange: (props, changedValues, allValues) => {
    if (changedValues.money === '' || changedValues.money) {
      handleMoneyChange(props, allValues)
    }

    if (changedValues.strategyId) {
      handleStrategyChange(props, allValues)
    }
  }
})

class BudgetSetting extends Component {

  componentDidMount() {
    const { dispatch, match } = this.props
    const { params } = match
    dispatch({
      type: 'setBudget/start', payload: Object.assign(params, {
        startWebsocket: this.startWebsocket,
        closeWebsocket: this.closeWebsocket
      })
    })
  }
  // 限载页面
  componentWillUnmount() {
    this.closeWebsocket()
  }

  // 开起 websocket
  startWebsocket = ({ symbols, webSocketName }) => {
    this.startGetAoleWebsocket({ symbols, webSocketName })
  }

  // 关闭 websocket 
  closeWebsocket = () => {
    this.closeGetAoleWebsocket()
  }

  // 获取 货币对最新报价 webSocket
  startGetAoleWebsocket({ symbols, webSocketName }) {
    const that = this

    if (webSocketName) {
      webSocketName.init({
        symbols: symbols,
        getOpenPrice: (value) => {
          that.getOpenPrice(value)
        }
      })
    }

  }

  getOpenPrice(values) {
    const { setBudget, dispatch } = this.props;
    const { freeCoinPairList,tradePatformApi } = setBudget
    const { tradePlatform } = tradePatformApi;
    const { name } = tradePlatform
    let symbol = values.symbol
    if(name === 'okex') {
      symbol = values.symbol.replace('-','').toLowerCase()
    } 

    console.log(symbol, '-----symbol')
    console.log(freeCoinPairList,'-----freeCoinPairList')

    dispatch({
      type: 'setBudget/updateState', payload: {
        freeCoinPairList: freeCoinPairList.map(item => item.coinPair.name === symbol
          ? Object.assign(item, values)
          : item
        )
      }
    })
  }

  // 关闭获取最新报价 webSocket
  closeGetAoleWebsocket = () => {
    const { setBudget } = this.props;
    const { webSocketName } = setBudget
    if (webSocketName) {
      webSocketName.close()
    }
  }


  handleAllChecked = (e) => {
    const { dispatch, setBudget, form } = this.props
    const { getFieldValue } = form
    const { freeCoinPairList = [], strategyExplain: { lever = 0 } } = setBudget
    let money = getFieldValue('money') || 0


    let size = freeCoinPairList.length

    dispatch({
      type: 'setBudget/updateState', payload: {
        allChecked: e.target.checked,
        totalMoney: e.target.checked && money && lever ? money * lever : 0,
        totalNumber: e.target.checked ? size : 0,
        freeCoinPairList: freeCoinPairList.map(item => Object.assign(item, {
          item_checked: e.target.checked,
          item_money: size === 0 ? '' : twoNumber(money / size),
          item_strategyId: getFieldValue('strategyId') || '',
          item_lever: lever || ''
        }))
      }
    })
  }

  handleFormOk = () => {
    const { dispatch, form } = this.props
    dispatch({
      type: 'setBudget/handleFormOk', payload: { form }
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    const { setBudget, form } = this.props
    const { freeCoinPairList } = setBudget

    form.validateFields((err) => {

      if (!err) {
        const is_checked_list = freeCoinPairList.filter(item => item.item_checked === true)
        const size = is_checked_list.length
        if (size === 0) {
          message.warning('请选择货币对！')
          return
        }

        const is_No_money_list = is_checked_list.filter(item => item.item_money === '')

        if (is_No_money_list.length) {
          message.warning('请输入本金！')
          return
        }

        const is_money_zero_list = is_checked_list.filter(item => String(item.item_money) === '0')

        if (is_money_zero_list.length) {
          message.warning('本金不能为零！')
          return
        }

        const is_No_strategyId_list = is_checked_list.filter(item => item.item_strategyId === '')

        if (is_No_strategyId_list.length) {
          message.warning('请选择策略！')
          return
        }
        this.handleFormOk()
      }
    });
  };

  isNumber = (_, value, callback) => {

    if (value && !isNumber(value)) {
      callback("本金必须为数字");
    }

    callback();
  };

  isShowTips = () => {
    const { form: { getFieldValue } } = this.props

    let strategyId = getFieldValue('strategyId')

    return strategyId === 7 || strategyId === 8 || strategyId === 9
  }

  getStrategyName = () => {
    const { form: { getFieldValue }, setBudget } = this.props
    const { strategyList } = setBudget

    let strategyId = getFieldValue('strategyId')
    let item = strategyList.find(item => item.id === strategyId) || {}

    return item.name || '---'
  }

  render() {

    const { dispatch, setBudget, history, form } = this.props
    const { strategyList,
      freeCoinPairList,
      allChecked,
      totalNumber,
      totalMoney,
      strategyExplain,
      loading,
      coinLoading,
      coin } = setBudget

    const { name = '' } = coin

    console.log(freeCoinPairList,'-----freeCoinPairList')

    const {
      lever = 0, //杠杆倍数
      rate = 0, //交易速率
      stopProfitTraceTriggerRate = 0, //追踪止盈触发比例
      buildReference = 0, // 最大持仓单数
      stopProfitTraceDropRate = 0, // 回降比例 
    } = strategyExplain

    const onBack = () => {
      history.goBack()
    }

    const handleFormCancel = () => {
      dispatch({ type: 'setBudget/handleFormCancel', payload: { history, form } })
    }

    const { getFieldDecorator, getFieldValue } = this.props.form;

    return (
      <Spin tip="Loading..." spinning={loading} delay="120">
        <NewPageHeader title='一键设置' onBack={onBack} />
        <div className={style.wrapper}>
          <Form onSubmit={(e) => this.handleSubmit(e)} className="login-form" {...formItemLayout}>

            <Form.Item label='本金预算'>
              <Row type='flex' justify='start' align='middle'>
                <Col span={8}>
                  {getFieldDecorator('money', {
                    rules: [{
                      validator: this.isNumber
                    }]
                  })(
                    <Input placeholder="请输入本金" />
                  )}
                </Col>
                <Col offset={1}>{name ? name.toUpperCase() : ''}</Col>
              </Row>
            </Form.Item>

            <Form.Item label='策略类型'>
              <Row type='flex' justify='start' align='middle'>
                <Col span={8}>
                  {getFieldDecorator('strategyId', {
                    initialValue: strategyList && JSON.stringify(strategyList) !== '[]' ? strategyList[0].id : ''
                  })(
                    <Select>
                      {strategyList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                    </Select>
                  )}
                </Col>
                <Col offset={1}>建议选择保守类，可单独调整</Col>
              </Row>
            </Form.Item>

            <Row type='flex' justify='start' align='middle'>
              <Col span={6} offset={4} className={style.tips}>
                <div className={style.tips_text}>
                  <span>策略类型：</span>{this.getStrategyName()}
                </div>
                <div style={{ color: 'red', display: this.isShowTips() ? 'block' : 'none' }} className={style.tips_text}>做单频率比较高，需要较多本金，请慎重选择</div>
                <div className={style.tips_text}>
                  <span>本金倍数：</span>{lever && Number(lever) !== 0 ? lever : '---'} 倍（预算=本金预算×{lever && Number(lever) !== 0 ? lever : '---'}）
                </div>
                <div className={style.tips_text}>
                  <span>交易速率：</span> {rate && Number(rate) !== 0 ? rate : '---'} 档（最大持仓 {buildReference && Number(buildReference) !== 0 ? buildReference : '---'} 单)
                  </div>
                <div className={style.tips_text}>
                  <span>追踪止盈：</span>
                  <span>触发比例 {stopProfitTraceTriggerRate && Number(stopProfitTraceTriggerRate) !== 0 ? `${Number(stopProfitTraceTriggerRate) * 100} %` : '---'}，</span>
                  <span>回降比例 {stopProfitTraceDropRate && Number(stopProfitTraceDropRate) !== 0 ? `${Number(stopProfitTraceDropRate) * 100} %` : '---'}</span>
                </div>
              </Col>
            </Row>

            <Form.Item label='选择货币对'>
              {getFieldDecorator('currency')(
                <Row type='flex' justify='start' align='middle' style={{ borderBottom: '1px solid #000' }}>
                  <Col span={4}><Checkbox checked={allChecked} onChange={(e) => this.handleAllChecked(e)}>货币对</Checkbox></Col>
                  <Col span={8}>本金预算（{name ? name.toUpperCase() : ''}）</Col>
                  <Col span={4}>策略类型</Col>
                  <Col span={8} style={{ fontSize: '12px' }}>仅可设置未交易的货币对</Col>
                </Row>
              )}
            </Form.Item>
            <Spin tip="Loading..." spinning={coinLoading} delay="120">
              {
                freeCoinPairList.map(item => <ListItem
                  money={getFieldValue('money')}
                  strategyId={getFieldValue('strategyId')}
                  key={item.id}
                  {...this.props}
                  coinItem={item}
                />)
              }
            </Spin>

            <Row type='flex' justify='space-between' align='middle' className={style.footer_button}>
              <Col>已经选择{totalNumber || 0}个货币对，共分配预算{totalMoney || 0}{name ? name.toUpperCase() : ''}</Col>
              <Col>
                <Button style={{ marginRight: '20px' }} onClick={() => handleFormCancel()}>取消 </Button>
                <Button type="primary" htmlType="submit" className="login-form-button">应用 </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </Spin>
    )
  }
}

export default BudgetSetting
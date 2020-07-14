import React, { Component } from 'react'
import { Input, Checkbox, Row, Col, Select } from 'antd';
import { twoNumber, isNumber } from 'utils';
import style from '../index.less'

const { Option } = Select;

export default class ListItem extends Component {

  handleOneChecked = (e, coinItem) => {
    const { dispatch, setBudget, money = 0, strategyId } = this.props
    const { freeCoinPairList, strategyExplain: { lever = 0 } } = setBudget

    console.log(strategyId, '-----strategyId')

    dispatch({
      type: 'setBudget/updateState', payload: {
        freeCoinPairList: freeCoinPairList.map(item => {
          if (item.id === coinItem.id) {
            item.item_checked = e.target.checked
          }
          return item
        })
      }
    })

    const is_checked_list = freeCoinPairList.filter(item => item.item_checked === true)
    const size = is_checked_list.length

    console.log(is_checked_list, '-----is_checked_list')
    console.log(money, '----money')


    dispatch({
      type: 'setBudget/updateState', payload: {
        freeCoinPairList: freeCoinPairList.map(item => {
          if (item.item_checked) {
            item.item_money = twoNumber(Number(money) / size)
            item.item_strategyId = strategyId
            item.item_lever = lever
          }
          return item
        })
      }
    })


    let totalMoney = 0
    for (let item of is_checked_list) {
      totalMoney += item.item_money && item.item_lever ? item.item_money * item.item_lever : 0
    }

    dispatch({
      type: 'setBudget/updateState', payload: {
        allChecked: size === freeCoinPairList.length ? true : false,
        totalMoney: totalMoney,
        totalNumber: size,
      }
    })

  }

  handleOneInput = (e, coinItem) => {
    const { dispatch, setBudget } = this.props
    const { freeCoinPairList } = setBudget

    const is_true = isNumber(e.target.value)
    if (e.target.value && !is_true) {
      return
    }

    dispatch({
      type: 'setBudget/updateState', payload: {
        freeCoinPairList: freeCoinPairList.map(item => {
          item.item_money = item.id === coinItem.id ? e.target.value : (item.item_money || '')
          return item
        })
      }
    })

    const is_checked_list = freeCoinPairList.filter(item => item.item_checked === true)

    let totalMoney = 0
    for (let item of is_checked_list) {
      totalMoney += twoNumber(item.item_money) * item.item_lever
    }
    dispatch({
      type: 'setBudget/updateState', payload: {
        totalMoney: twoNumber(totalMoney),
      }
    })
  }

  handleOneSelect = (e, coinItem) => {
    const { dispatch, setBudget } = this.props
    const { freeCoinPairList, strategyExplainArray } = setBudget

    dispatch({
      type: 'setBudget/updateState', payload: {
        freeCoinPairList: freeCoinPairList.map(item => {
          if (item.id === coinItem.id) {
            item.item_strategyId = e
            item.item_lever = strategyExplainArray.find(i => i.id === e).lever
          }
          return item
        })
      }
    })

    const is_checked_list = freeCoinPairList.filter(item => item.item_checked === true)
    let totalMoney = 0
    for (let item of is_checked_list) {
      totalMoney += twoNumber(item.item_money) * item.item_lever
    }
    dispatch({
      type: 'setBudget/updateState', payload: {
        totalMoney: totalMoney,
      }
    })
  }

  render() {
    const { coinItem } = this.props

    const { policy_name, coinPair: { name }, budget, strategyList = [], item_checked, item_money = 0, item_strategyId } = coinItem

    return (
      <Row type='flex' justify='space-between' align='middle' style={{ height: '80px' }}>
        <Col span={12} offset={4}>
          <Row type='flex' justify='start' align='middle' className={style.checkbox_row}>
            <Col span={4}>
              <Checkbox checked={item_checked} value={item_checked} onChange={(e) => this.handleOneChecked(e, coinItem)}>{name}</Checkbox>
            </Col>
            <Col span={8} className={style.checkbox_row_input}>
              <Input
                placeholder="请输入本金"
                style={{ width: '90%' }}
                disabled={!item_checked}
                value={item_money}
                onChange={(e) => this.handleOneInput(e, coinItem)}
              />

              <Row type='flex' justify='space-between' align='middle' style={{ width: '90%' }} className={style.checkbox_row_input_tips}>
                <Col>当前</Col>
                <Col>{budget ? Number(budget).toFixed(2) : '未设置'}</Col>
              </Row>
            </Col>
            <Col span={4} className={style.checkbox_row_input}>

              <Select disabled={!item_checked} value={item_strategyId} onChange={(e) => this.handleOneSelect(e, coinItem)}>
                {strategyList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
              </Select>
              <Row type='flex' justify='space-between' align='middle' className={style.checkbox_row_input_tips}>
                <Col>当前</Col>
                <Col>{policy_name || '未设置'}</Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>

    )
  }
}

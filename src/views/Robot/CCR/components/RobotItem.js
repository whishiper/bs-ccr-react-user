import React, { Component } from "react";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import { Card, Row, Col, Form, Modal, Button, message } from "antd";
import BindApiItem from './BindApiItem/index';

import style from "../index.less";


@connect(({ ccr }) => ({ ccr }))
@Form.create()

class RobotItem extends Component {
  state = {
    value: '',
    copied: false,
  };

  render() {
    const { dispatch, form, cardItem, ccr } = this.props;
    const { remainTime, productLogo, tradePlatformApiBindProductComboId, tradePlatformId, tradePlatformApiId, userProductComboId } = cardItem

    const { apiList } = ccr

    const confirm = value => {
      const { values } = value
      let modal = {
        method: 'confirm',
        title: "设置交易平台",
        content: "设置交易平台",
        okText: "确定",
      }
      console.log(values.apiId !== 'unbound')
      if (values.apiId !== 'unbound') {
        if (!tradePlatformApiBindProductComboId) {
          // 设置 api
          modal = {
            method: 'confirm',
            title: "监控API",
            content: "机器人将监控huobi的api,您可以添加货币对进行交易确定要监控吗？",
            okText: "确定",
          }
        } else {
          // 跟换 api
          modal = {
            method: 'confirm',
            title: "更换交易平台",
            content: "检测到您跟换了交易平台，更换后，原交易平台的订单将停止监控是否更换？",
            okText: "更换",
          }
        }

      } else {
        // 解除 api 绑定
        modal = {
          method: 'confirm',
          title: "解除交易平台",
          content: "解除监控后，当前API的所有订单将停止监控。是否取消绑定",
          okText: "不绑定",
        }
      }

      Modal[modal.method]({
        title: modal.title,
        content: modal.content,
        okText: modal.okText,
        icon: null,
        cancelText: "我再想想",
        onOk: () => {
          if (!values.apiId) {
            message.error('绑定api不能为空！');
            return;
          }
          dispatch({ type: "ccr/handleSetApiFromSubmit", payload: value });
        },
        onCancel: () => {
          dispatch({ type: "ccr/handleSetApiFromCancel", payload: value });
        }
      });
    };

    const isShowRenewModal = () => {
      Modal.warning({
        title: '续费提醒',
        content: (
          <div>
            <p><span style={{ fontWeight: 'bold', color: '#000' }}>机器人编号：87 </span>CCR智能交易机器人已过期</p>
            <p>请联系客服，续费！</p>
          </div>
        ),
      });
    }

    const handleConfirmShwo = () => {
      form.validateFields((err, values) => {
        if (!err) {
          confirm({ values, form, cardItem });
        }
      });
    };


    const setApiFromShow = () => {

      if (Number(remainTime) === 0) {
        isShowRenewModal()
        return
      }

      dispatch({
        type: "ccr/setApiFromShow", payload: {
          cardItem,
        }
      });
    };

    const setApiFromHide = () => {
      dispatch({
        type: "ccr/setApiFromHide", payload: {
          cardItem,
        }
      });
    };


    const goToProfitSummary = () => {

      // if (Number(remainTime) === 0) {
      //   isShowRenewModal()
      //   return
      // }

      dispatch(routerRedux.push(`/ccr/profit/summary/${userProductComboId}/${tradePlatformApiBindProductComboId}/${tradePlatformId}/${tradePlatformApiId}/`));
    }

    const goToBuyLogs = () => {

      // if (Number(remainTime) === 0) {
      //   isShowRenewModal()
      //   return
      // }

      dispatch(routerRedux.push(`/ccr/buy/logs/${userProductComboId}/${tradePlatformApiBindProductComboId}/${tradePlatformId}/${tradePlatformApiId}/`));
    }

    const actions = () => {
      let item;
      cardItem.isShowSetApiFrom
        ?
        item = [
          <Button
            type="link"
            style={{ width: '100%' }}
            onClick={setApiFromHide}
          >取消</Button>,
          <Button
            type="link"
            onClick={handleConfirmShwo}
            style={{ width: '100%' }}>完成</Button>
        ]
        :
        item = [
          <Button
            type="link"
            disabled={tradePlatformApiBindProductComboId ? false : true}
            style={{ width: '100%' }}
            onClick={() => goToProfitSummary()}
          >
            收益总结
          </Button>,
          <Button
            type="link"
            disabled={tradePlatformApiBindProductComboId ? false : true}
            style={{ width: '100%' }}
            onClick={() => goToBuyLogs()}
          >

            买入日志
          </Button>,
          <Button
            type="link"
            onClick={setApiFromShow}
            style={{ width: '100%' }}
            disabled={apiList && apiList.lenght !== 0 ? false : true}
          >设置API</Button>
        ]
      return item
    }

    return (
      <Card
        title={null}
        hoverable={true}
        type='inner'
        actions={actions()}
        style={{ margin: '24px 0' }}
      >
        <Row className={style.card}>
          <Col xs={24} sm={24} md={8} lg={8} xl={8} className={style.card_item_left} style={{ height: 'auto' }} >
            <img
              src={`http://bs-follow.oss-cn-shenzhen.aliyuncs.com/${productLogo}`}
              alt='logo'
              style={{ width: '120px' }}
            />
            <div className={style.text}>
              剩余<span style={{ padding: '0 5px' }}> {remainTime || 0}</span>天
            </div>
          </Col>
          {
            apiList
              ?
              <BindApiItem form={form} cardItem={cardItem} dispatch={dispatch} isShowRenewModal={isShowRenewModal} />
              :
              <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} className={style.card_item_col_center}>
                  未添加API，请先前往API页面添加API
                </Col>
              </Col>
          }
        </Row>
      </Card>
    );
  }
}

export default RobotItem;

import React, { Component } from 'react'
import { Col, Typography } from "antd";
import { routerRedux } from "dva/router";
import SetApiFrom from '../SetApiFrom/index';


import style from "./index.less";


const { Paragraph } = Typography;

export default class BindApiItem extends Component {

  render() {
    const { form, cardItem, dispatch } = this.props
    const { isShowSetApiFrom,
      ip,
      serverIp,
      tradePlatformLogo,
      tradePlatformApiNickname,
      userProductComboId,
      tradePlatformApiBindProductComboId,
      tradePlatformId,
      tradePlatformApiId,
      remainTime,
    } = cardItem

    const handleDealAdmin = () => {
      const { isShowRenewModal } = this.props

      if (Number(remainTime) === 0) {
        isShowRenewModal()
        return
      }

      sessionStorage.setItem('robotId', userProductComboId)
      sessionStorage.setItem('tradePlatformApiBindProductComboId', tradePlatformApiBindProductComboId)
      dispatch(routerRedux.push(`/ccr/deal/${userProductComboId}/${tradePlatformApiBindProductComboId}/${tradePlatformId}/${tradePlatformApiId}/coin_pair_choice_list`));
    }

    const isShwoTradePlatformApi = () => {

      return <Col xs={24} sm={24} md={16} lg={16} xl={16} style={{ height: '120px' }}>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} className={style.card_content_item}>
          {
            tradePlatformApiBindProductComboId
              ?
              <div className={style.card_item_col_center}>
                <img src={tradePlatformLogo? `http://yun-img.bosenkeji.cn${tradePlatformLogo}`: ''}  alt="logo" style={{ width: '200px', height: 'auto' }} />
                <div className={style.text}> {tradePlatformApiNickname}</div>
              </div>
              :
              <div className={style.no_bind_api}>未绑定交易平台帐号，请点击设置API进行绑定</div>
          }
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} className={style.card_item_right}>

          <div>机器人编号：{userProductComboId || '---'}</div>
          <div className={style.ip} style={{ display: ip && serverIp ? 'block' : 'none' }}>
            <span>IP：{`${serverIp},${ip}`}</span>
            <span className={style.copy}>
              <Paragraph
                style={{ display: 'inline' }}
                onClick={(e) => { e.stopPropagation() }}
                copyable={{ text: `${ip},${serverIp}` }} />
            </span>
          </div>
          <span
            style={{
              color: '#1890ff',
              cursor: 'pointer',
              fontSize: '20px',
              display: tradePlatformApiBindProductComboId ? 'block' : 'none'
            }}
          >
            <a onClick={() => handleDealAdmin()}>交易详情</a>
          </span>
        </Col>
      </Col>

    }
    return (
      <>
        {
          isShowSetApiFrom
            ?
            <Col xs={24} sm={24} md={24} lg={16} xl={16} className={style.card_set_from} >
              <SetApiFrom
                form={form}
                isShowUnbound={tradePlatformApiBindProductComboId}
                cardItem={cardItem}
              />
            </Col>
            : isShwoTradePlatformApi()
        }
      </>
    )
  }
}

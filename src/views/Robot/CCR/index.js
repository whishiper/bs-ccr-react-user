import React, { Component } from "react";
import { connect } from "dva";
import { Spin, Row, Menu, Dropdown } from "antd";
import RobotItem from "./components/RobotItem";
import ActiveCard from './components/ActiveCard/index'
import ActivationCodeModal from './components/ActivationCodeModal'
import ResultModal from './components/ResultModal'
import ExplainModal from './components/ExplainModal'
import IPExplain from './components/IPExplain'
import PromptBox from 'components/PromptBox'
import style from "./index.less";

@connect(({ ccr }) => ({ ccr }))

class CCR extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'ccr/start' })
  }
  render() {
    const { ccr, dispatch } = this.props;
    const {
      robotList,
      prompt_box_visible,
      prompt_box_text,
      validation_api_type,
      loading,
      ipArray,
      iPExplainVisible,
      robotExplainVisible
    } = ccr;

    const onPromptBoxCancel = () => {
      dispatch({
        type: "ccr/updateState", payload: {
          prompt_box_visible: false
        }
      });
    };

    const activeCodeModalShow = () => {
      dispatch({
        type: "ccr/updateState", payload: {
          activationVisible: true
        }
      });
    };

    const handleIPExplainCancel = () => {
      dispatch({
        type: "ccr/updateState", payload: {
          iPExplainVisible: false
        }
      });
    }
    const handleRobotExplainCancel = () => {
      dispatch({
        type: "ccr/updateState", payload: {
          robotExplainVisible: false
        }
      });
    }

    const handleMenu = (e) => {
      console.log(e)
      if (e.key === 'ip') {
        dispatch({
          type: "ccr/updateState", payload: {
            iPExplainVisible: true
          }
        });
      } else if (e.key === 'robot') {
        dispatch({
          type: "ccr/updateState", payload: {
            robotExplainVisible: true
          }
        });
      }
    }


    const menu = (
      <Menu onClick={(e) => { handleMenu(e) }}>
        <Menu.Item key="ip">
          <a>IP说明</a>
        </Menu.Item>
        <Menu.Item key="robot">
          <a>机器人说明</a>
        </Menu.Item>

      </Menu>
    );

    return (

      <div className={style.warpper}>
        <Spin tip="Loading..." spinning={loading} delay="120">
          <Row className={style.header}>
            <h4 style={{ textAlign: 'center' }}>CCR智能交易机器人</h4>
            <Dropdown overlay={menu}>
              <a className={style.help}>帮助</a>
            </Dropdown>
          </Row>
          {
            robotList.map(item => <RobotItem key={`${item.userProductComboId}`} cardItem={item} />)
          }
          <ActiveCard activeCodeModalShow={activeCodeModalShow} />
          <ActivationCodeModal />
          <ResultModal />
          <PromptBox
            type={validation_api_type}
            visible={prompt_box_visible}
            msg={prompt_box_text}
            onPromptBoxCancel={onPromptBoxCancel}
          />
          <ExplainModal
            title='IP说明'
            visible={iPExplainVisible}
            handleCancel={handleIPExplainCancel}
          >
            <IPExplain ip={ipArray} robotList={robotList} />
          </ExplainModal>
          <ExplainModal
            title='机器人说明'
            visible={robotExplainVisible}
            handleCancel={handleRobotExplainCancel}
          >
            <Row type='flex' justify='center' align='middle'>
              <span style={{ color: 'AAAAAA', padding: '20px 0' }}>请在设置API进行API绑定，绑定后即可添加货币对进行交易</span>
              <span style={{ color: 'AAAAAA', padding: '20px 0' }}>如需交易多个API，可以添加多个机器人，请联系推荐人购买</span>
            </Row>
          </ExplainModal>
        </Spin>
      </div>

    );
  }
}

export default CCR;

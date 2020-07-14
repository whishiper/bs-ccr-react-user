import React, { Component } from 'react';
import { connect } from "dva";
import { Modal, Result, Button } from 'antd';

@connect(({ ccr }) => ({ ccr }))

class ResultModal extends Component {

  render() {
    const { props } = this;
    const { ccr, dispatch } = props;
    const { resultVisible } = ccr;

    const handleCancel = () => {
      dispatch({
        type: 'ccr/updateState', payload: {
          resultVisible: false,
        }
      })
    }

    const handlOK = () => {
      dispatch({
        type: 'ccr/updateState', payload: {
          resultVisible: false,
        }
      })
    }

    return (
      <Modal
        title={null}
        visible={resultVisible}
        onCancel={handleCancel}
        footer={null}
        closable={null}
        centered={true}
        maskClosable={false}
      >
        <Result
          status="success"
          title="激活成功"
          subTitle={
            <span>激活成功，请耐心等待部署，<br />部署完成后我就可以帮助主人进行量化交易啦！</span>
          }
          extra={[<Button type="primary" key="console" onClick={()=>{handlOK()}}>确定</Button>]}
        />
      </Modal>
    );
  }
}

export default ResultModal;

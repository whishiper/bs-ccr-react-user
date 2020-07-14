import React, { Component } from 'react';
import { connect } from "dva";
import { Modal, Result, Icon, Button } from 'antd';


@connect(({ dealAdmin }) => ({ dealAdmin }))

class SetBudgetModal extends Component {

  render() {
    const { props } = this;
    const { dealAdmin, dispatch } = props;
    const { setBudgetModalVisible } = dealAdmin;

    const handleCancel = () => {
      dispatch({ type: 'dealAdmin/updateState', payload: {
        setBudgetModalVisible: false,
      } })
    }

    const handlOK = () => {
      dispatch({ type: 'dealAdmin/updateState', payload: {
        setBudgetModalVisible: false,
      } })
    }

    return (
      <Modal
        title='设置预算'
        visible={setBudgetModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered={true}
        width={800}
      >
        <Result
          icon={<Icon type="smile" theme="twoTone" />}
          title="即将到来"
          extra={<Button type="primary" onClick={handlOK}>返回</Button>}
        />
      </Modal>
    );
  }
}

export default SetBudgetModal;

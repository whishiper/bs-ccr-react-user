import React, { Component } from 'react'
import { Modal } from 'antd'

export default class ExplainModal extends Component {
  render() {
    const { children, title, visible, handleCancel } = this.props
    return (
      <Modal
        title={title}
        footer={null}
        visible={visible}
        onCancel={handleCancel}
      >
        {children}
      </Modal>
    )
  }
}


import React from 'react';
import { Result, Modal } from 'antd';

const PromptBox = ({
  msg,
  type,
  visible,
  onPromptBoxCancel
}) => {
  return (
    <Modal
      visible={visible}
      footer={null}
      onCancel={onPromptBoxCancel}
    >
      <Result
        status={type}
        subTitle={msg}
      />
    </Modal>
  );
};
export default PromptBox

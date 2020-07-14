import React, { Component } from 'react';
import { PageHeader, Icon, Affix } from 'antd';
import style from './index.less';

class NewPageHeader extends Component {

  render() {
    const { props } = this;
    const { title, onBack } = props;
    return (
      <Affix offsetTop={0}>
        <PageHeader
          className={style.header}
          backIcon={<Icon type="left" style={{ fontSize: '18px' }} />}
          onBack={onBack}
          title={title}
        />
      </Affix>
    );
  }
}

export default NewPageHeader;

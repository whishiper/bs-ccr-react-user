import React, { Component } from 'react'
import { Row, Drawer, Select, Radio } from 'antd';
import style from './index.less';

const { Option } = Select;


class NewDrawer extends Component {

  render() {
    const { state, onClose, handleChange } = this.props
    const { placement, visible } = state
    return (
      <Drawer
        title="切换货币对"
        placement={placement}
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <Row className={style.drawer}>
          <Select defaultValue="lucy" style={{ width: '80%' }} onChange={(e) => handleChange(e)}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
          <Radio.Group defaultValue="a" buttonStyle="solid" className={style.radio}>
            <Radio.Button className={style.radio_item} value="a">Hangzhou</Radio.Button>
            <Radio.Button className={style.radio_item} value="b">Shanghai</Radio.Button>
            <Radio.Button className={style.radio_item} value="c">Beijing</Radio.Button>
            <Radio.Button className={style.radio_item} value="d">Chengdu</Radio.Button>
          </Radio.Group>
        </Row>
      </Drawer>
    )
  }
}
export default NewDrawer
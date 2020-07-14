import React, { Component } from 'react'
import { DatePicker, Radio, Row, Col } from 'antd';
import getDate from 'utils/getDate';
import style from './index.less';

const { RangePicker } = DatePicker;

class TradeTime extends Component {

  render() {
    const {
      rangePickerOnChange,
      handleTimeChange,
      time
    } = this.props;

    return (
      <Row className={style.main}>
        <Col className={style.left}>时间：</Col>
        <Col className={style.time_main}>
          <Radio.Group
            onChange={handleTimeChange}
            className={style.time_radio_group}
            defaultValue='all'
            value={`${time}`}
            buttonStyle="solid"
          >
            <Radio.Button className={style.time_but} value="all">全部</Radio.Button>
            <Radio.Button
              className={style.time_but}
              value={`${getDate('今天')}`}
            >今天</Radio.Button>
            <Radio.Button
              className={style.time_but}
              value={`${getDate('昨天')}`}
            >昨天</Radio.Button>
            <Radio.Button
              className={style.time_but}
              value={`${getDate('本周')}`}>本周</Radio.Button>
            <Radio.Button
              className={style.time_but}
              value={`${getDate('本月')}`}
            >本月</Radio.Button>
          </Radio.Group>
          <RangePicker
            className={style.time_but}
            placeholder={['开始时间', '完成时间']}
            format="YYYY-MM-DD"
            onChange={(e)=>rangePickerOnChange(e)}
          />

        </Col>
      </Row>
    )
  }
}

export default TradeTime;
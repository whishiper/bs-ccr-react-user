import React, { Component } from "react";
import { Result, Button } from "antd";

class NoAuth extends Component {
  goFristPage() {
    this.props.history.push('/ccr/user/api')
  }
  render() {
    return (
      <Result
        status="403"
        title="403"
        subTitle="您没有权限访问！"
        extra={<Button type="primary" onClick={()=>{this.goFristPage()}}	>返回首页</Button>}
      />
    );
  }
}
export default NoAuth;

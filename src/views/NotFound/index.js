import React, { Component } from "react";
import { Result, Button } from "antd";

class NotFound extends Component {

  goFristPage() {
    this.props.history.push('/ccr/user/api')
  }
  render() {
    return (
      <Result
        status="404"
        title="404"
        subTitle="没有找到您想要的资源！"
        extra={<Button type="primary" onClick={()=>{this.goFristPage()}}	>返回首页</Button>}
      />
    );
  }
};
export default NotFound;
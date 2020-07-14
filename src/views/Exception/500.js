import React, { Component } from "react";
import { Result, Button } from "antd";

class FourFour extends Component {
  render() {
    return (
      <Result
        status="500"
        title="500"
        subTitle="Sorry, the server is wrong."
        extra={<Button type="primary" href="#/user/api">Back Home</Button>}
      />
    );
  }
}
export default FourFour;

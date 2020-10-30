import React, { Component } from "react";
import { Button } from "antd-mobile";
import { reqVerifyCode } from "@api/common";
export default class VerifyButton extends Component {
  componentDidMount() {
    window.verifyCallback = async (res) => {
      // console.log(res);

      // res.ret=0时为校验成功
      if (res.ret === 0) {
        // 客户端验证成功，再进行服务端验证
        await reqVerifyCode(res.randstr, res.ticket);
        //做其他事
        this.props.callback();
      }
    };
  }
  render() {
    const { isDisabled, buttonText } = this.props;
    return (
      <div>
        <Button
          type="warning"
          className="warning-btn"
          disabled
          style={{ display: isDisabled ? "block" : "none" }}
        >
          {buttonText}
        </Button>
        <Button
          style={{ display: !isDisabled ? "block" : "none" }}
          id="TencentCaptcha"
          data-appid="2030765311"
          data-cbfn="verifyCallback"
          className="warning-btn"
          type="warning"
        >
          {buttonText}
        </Button>
      </div>
    );
  }
}

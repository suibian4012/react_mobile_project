import React, { Component } from "react";
import {
  NavBar,
  Icon,
  InputItem,
  WingBlank,
  Button,
  Modal,
  Toast,
} from "antd-mobile";
import { createForm } from "rc-form";
import "./index.css";
import { reqVerifyPhone } from "@api/regist";
// import { reqVerifyCode } from "@api/common";
// import VerifyButton from "../../../components/VerifyButton";
import VerifyButton from "@components/VerifyButton";
class VerifyPhone extends Component {
  state = {
    isDisabled: true,
  };
  componentDidMount() {
    // Modal.alert(
    //   "注册协议及隐私政策",
    //   <span className="policy-text">
    //     在您注册成为硅谷用户的过程中，您需要完成我们的注册流程并通过点击同意的形式在线签署以下协议，
    //     <strong className="policy-strong-text">
    //       请您务必仔细阅读、充分理解协议中的条款内容后再点击同意（尤其是以粗体并下划线标识的条款，因为这些条款可能会明确您应履行的义务或对您的权利有所限制）
    //     </strong>
    //     ：<span className="policy-content">《硅谷用户注册协议》</span>
    //     <span className="policy-content">《硅谷隐私政策》</span>
    //   </span>,
    //   [
    //     {
    //       text: "不同意",
    //       onPress: () => console.log("cancel"),
    //     },
    //     {
    //       text: "同意",
    //       onPress: () => console.log("ok"),
    //       style: { backgroundColor: "red", color: "#fff" },
    //     },
    //   ]
    // );
    //输入通过正则校验的手机号后，点击下一步进行图形验证码
    // window.verifyCallback = async (res) => {
    //   console.log(res);
    //   // res.ret=0时为校验成功
    //   if (res.ret === 0) {
    //     // 客户端验证成功，再进行服务端验证
    //     await reqVerifyCode(res.randstr, res.ticket);
    //     //客户端和服务端都验证成功，再进行手机号验证，看是否已经存在（已经注册过）
    //     await this.next();
    //   }
    // };
  }
  validator = (rule, value, callback) => {
    const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
    let isDisabled = true;
    if (reg.test(value)) {
      isDisabled = false;
    }
    this.setState({
      isDisabled,
    });
    //callback必须调用
    callback();
  };
  //服务端验证手机号是否存在(即是否已经注册过)
  next = async () => {
    //获取输入框输入的值
    try {
      const phone = this.props.form.getFieldValue("phone");
      const result = await reqVerifyPhone(phone);
      console.log("success");
    } catch (e) {
      Toast.fail(e, 3);
    }
  };
  render() {
    const { isDisabled } = this.state;
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" className="left" />}
          onLeftClick={() => console.log("onLeftClick")}
        >
          硅谷注册
        </NavBar>
        <WingBlank>
          <div className="verify-phone-input">
            <InputItem
              clear
              placeholder="请输入手机号"
              {...getFieldProps("phone", {
                rules: [{ validator: this.validator }],
              })}
            >
              <div className="verify-phone-prefix">
                <span>+86</span>
                <Icon type="down" />
              </div>
            </InputItem>
            {/* <Button
              type="warning"
              className="warning-btn"
              disabled
              style={{ display: isDisabled ? "block" : "none" }}
            >
              下一步
            </Button>
            <Button
              style={{ display: !isDisabled ? "block" : "none" }}
              id="TencentCaptcha"
              data-appid="2030765311"
              data-cbfn="verifyCallback"
              className="warning-btn"
              type="warning"
            >
              下一步
            </Button> */}
            <VerifyButton isDisabled={isDisabled} callback={this.next} />
          </div>
        </WingBlank>
      </div>
    );
  }
}
//高阶组件，用来给VerifyPhone传递form
export default createForm()(VerifyPhone);

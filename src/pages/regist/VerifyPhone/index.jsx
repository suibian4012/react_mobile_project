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
import { reqSendCode } from "@api/login";
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
  verifyPhone = async () => {
    //获取输入框输入的值
    try {
      const phone = this.props.form.getFieldValue("phone");
      const result = await reqVerifyPhone(phone);
      // 请求成功 - 手机号不存在
      // 提示弹框 - 确认请求短信验证码
      this.sendCode(phone);
    } catch (e) {
      if (e === "fail") return;
      // 请求失败 - 手机号存在
      Toast.fail(e, 3);
    }
  };
  //发送短信验证码
  sendCode = (phone) => {
    Modal.alert("", `我们将发送短信/语音验证码至：${phone}`, [
      {
        text: "不同意",
      },
      {
        text: "同意",
        style: { backgroundColor: "red", color: "#fff" },
        onPress: async () => {
          //发送短信验证码请求
          await reqSendCode(phone);
          //成功则路由跳转
          this.props.history.push("/regist/verifycode");
        },
      },
    ]);
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

            <VerifyButton
              isDisabled={isDisabled}
              callback={this.verifyPhone}
              buttonText={"下一步"}
            />
          </div>
        </WingBlank>
      </div>
    );
  }
}
//高阶组件，用来给VerifyPhone传递form
export default createForm()(VerifyPhone);

import React, { Component } from "react";
import { NavBar, Icon, WingBlank, InputItem, Button, Modal } from "antd-mobile";
import { createForm } from "rc-form";
import msg from "./msg.png";
import "./index.css";
import { reqVerifyCode } from "@api/regist";
import { reqSendCode } from "@api/login";
import { codeReg } from "@utils/reg";
const TOTAL_TIME = 10; //倒计时总时间
class VerifyCode extends Component {
  state = {
    isSendCode: true, //切换发送验证码和倒计时按钮,true倒计时
    time: TOTAL_TIME, //倒计时时间
    isDisabled: true, //用来控制下一步按钮的禁用状态
  };
  componentDidMount() {
    //跳转到该页面就启动倒计时
    this.setTimer();
  }
  //倒计时
  setTimer = () => {
    this.timer = setInterval(() => {
      const time = this.state.time - 1;
      //时间到了，则切换按钮状态，同时清除计时器
      if (time <= 0) {
        clearInterval(this.timer);
        this.setState({
          isSendCode: false,
          time: TOTAL_TIME,
        });
        return;
      }
      //时间没到，设置time，实现倒计时效果
      this.setState({
        time,
      });
    }, 1000);
  };
  //点击弹框确认按钮发送验证码
  sendCode = () => {
    //从路由获取phone参数
    const phone = this.props.location.state;
    //短信验证码弹框
    Modal.alert("", `我们将发送短信/语音验证码至：${phone}`, [
      {
        text: "取消",
      },
      {
        text: "确定",
        style: { backgroundColor: "red", color: "#fff" },
        onPress: async () => {
          //点击确定发送请求（发送短信验证码）
          await reqSendCode(phone);
          //按钮切换到倒计时状态
          this.setState({
            isSendCode: true,
          });
          //重新计时
          this.setTimer();
        },
      },
    ]);
  };
  //验证输入的手机验证码是否符合正则，符合则下一步按钮状态为启用，否则为禁用状态
  validatorCode = async (rule, value, callback) => {
    let isDisabled = true;
    if (codeReg.test(value)) {
      //通过正则验证，则将下一步按钮状态改为启动状态
      isDisabled = false;
    }
    this.setState({
      isDisabled,
    });
    callback();
  };
  //当输入的验证码通过正则，点击下一步按钮发送请求验证验证码是否正确
  next = async () => {
    //获取发送请求所需参数
    const phone = this.props.location.state;
    const code = this.props.form.getFieldValue("code");
    await reqVerifyCode(phone, code);
    //验证码校验成功，则添砖密码界面
    this.props.history.push("/regist/verifypassword", phone);
  };
  render() {
    const { isSendCode, time, isDisabled } = this.state;
    const btnClass =
      "verify-code-btn" + (isSendCode ? "verify-code-btn-disabled" : "");
    const btnText = isSendCode ? `重新发送(${time}s)` : "获取验证码";
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon className="left" type="left" />}
          onLeftClick={() => this.props.history.goBack()}
        >
          硅谷注册
        </NavBar>
        <WingBlank>
          <img className="verify-code-msg" src={msg} alt="msg" />
          <p className="verify-code-tip">
            我们将以短信或电话的形式将验证码发送给您，请注意接听0575/025/0592/010等开头的电话
          </p>
          <div className="verify-code-container">
            <InputItem
              placeholder="请输入手机验证码"
              {...getFieldProps("code", {
                rules: [{ validator: this.validatorCode }],
              })}
            />
            <Button className={btnClass} onClick={this.sendCode}>
              {btnText}
            </Button>
          </div>
          <Button
            type="warning"
            disabled
            className="warning-btn"
            disabled={isDisabled}
            onClick={this.next}
          >
            下一步
          </Button>
          <span className="verify-code-question">
            遇到问题?请<a>联系客服</a>
          </span>
        </WingBlank>
      </div>
    );
  }
}
export default createForm()(VerifyCode);

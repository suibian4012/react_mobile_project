import React, { Component } from "react";
import {
  NavBar,
  Icon,
  InputItem,
  WingBlank,
  WhiteSpace,
  Button,
  Toast,
} from "antd-mobile";
import { Link } from "react-router-dom";
import { createForm } from "rc-form";
import { phoneReg, codeReg } from "@utils/reg";
import { reqSendCode } from "@api/login";
import "./index.css";
const TOTAL_TIME = 6;
class Login extends Component {
  state = {
    isDisabledGetCode: true, //控制获取验证码按钮的样式，true灰色，false高亮
    isDisabledLogin: true, //用来控制登录按钮状态
    isSendCode: false, //控制倒计时和重新获取按钮文本的切换，false为重新获取，true为倒计时
    timeout: TOTAL_TIME,
  };

  validator = (rule, value, callback) => {
    if (rule.field === "phone") {
      let isDisabledGetCode = true;
      if (phoneReg.test(value)) {
        isDisabledGetCode = false;
      }
      this.setState({
        isDisabledGetCode,
      });
    } else {
      let isDisabledLogin = true;
      if (codeReg.test(value)) {
        isDisabledLogin = false;
      }
      this.setState({
        isDisabledLogin,
      });
    }
    callback();
  };
  // 倒计时
  timeout = () => {
    this.timer = setInterval(() => {
      let timeout = this.state.timeout - 1;
      if (timeout <= 0) {
        clearInterval(this.timer);
        this.setState({
          isSendCode: false, //按钮文本变为获取验证码
          isDisabledGetCode: false, //按钮文本高亮显示
          timeout: TOTAL_TIME,
        });
        return;
      }
      this.setState({
        isDisabledGetCode: true,
        timeout,
      });
    }, 1000);
  };
  //请求验证码
  sendCode = async () => {
    //按钮状态为灰色时，无法点击
    if (this.state.isDisabledGetCode) return;
    const phone = this.props.form.getFieldValue("phone");
    await reqSendCode(phone);
    this.setState({
      isDisabledGetCode: false,
      isSendCode: true,
    });
    //倒计时
    this.timeout();
  };

  render() {
    const {
      form: { getFieldProps },
      location: { state },
    } = this.props;

    const {
      isDisabledGetCode,
      timeout,
      isSendCode,
      isDisabledLogin,
    } = this.state;
    return (
      <div className="login container">
        <NavBar
          mode="light"
          icon={<Icon className="icon-left" type="left" />}
          // onLeftClick={() => console.log("onLeftClick")}
        >
          硅谷注册登录
        </NavBar>
        <WhiteSpace size="xl" />
        <WingBlank size="lg">
          <InputItem
            clear
            placeholder="请输入手机号"
            {...getFieldProps("phone", {
              rules: [
                {
                  validator: this.validator,
                },
              ],
            })}
          >
            <div className="phone-prefix">
              <span>+86</span>
              <Icon type="down" />
            </div>
          </InputItem>
          <WhiteSpace size="lg" />
          <div className="login-code">
            <InputItem
              clear
              placeholder="请输入手机验证码"
              {...getFieldProps("code", {
                rules: [
                  {
                    validator: this.validator,
                  },
                ],
              })}
            />
            <button
              className="login-btn-text login-btn"
              style={{
                color: isDisabledGetCode ? "#848689" : "red",
              }}
              onTouchEnd={this.sendCode}
            >
              {isSendCode ? `重新获取(${timeout}s)` : "获取验证码"}
            </button>
          </div>
          <WhiteSpace size="lg" />
          <WingBlank size="lg">
            <Button
              type="warning"
              className="warning-btn"
              disabled={isDisabledLogin}
            >
              登录
            </Button>
          </WingBlank>
          <WhiteSpace size="lg" />
          <div className="login-btn-wrap">
            <Link to="/login/pwd" className="login-btn-text">
              账户密码登录
            </Link>
            <Link to="/regist/verifyphone" className="login-btn-text">
              手机快速注册
            </Link>
          </div>
          <div className="login-other-text">其他登录方式</div>
          <div className="login-icons">
            <span className="iconfont icon-github"></span>
            <span className="iconfont icon-qq"></span>
            <span className="iconfont icon-wechat"></span>
          </div>
          <span className="login-private-policy">
            未注册的手机号验证后将自动创建硅谷账号, 登录即代表您已同意
            <Link to="/login" className="login-private-policy-btn">
              硅谷隐私政策
            </Link>
          </span>
        </WingBlank>
      </div>
    );
  }
}

export default createForm()(Login);

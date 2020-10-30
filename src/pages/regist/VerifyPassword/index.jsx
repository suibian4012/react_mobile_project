import React, { useState } from "react";
import { NavBar, Icon, WingBlank, InputItem, Button } from "antd-mobile";
import { Link } from "react-router-dom";
import { createForm } from "rc-form";
import "./index.css";
import msg from "./msg.png";

function VerifyPassword({ form }) {
  //状态数据ciphertext，默认值为true密文,setciphertext设置密文
  const [ciphertext, setciphertext] = useState(true);
  //切换下一步按钮的状态
  const [isDisabled, setDisabled] = useState(true);
  //切换input的type
  const [isPwd, setPwd] = useState(true);
  const { getFieldProps, getFieldValue } = form;

  const iconClass = "iconfont " + (ciphertext ? "icon-eye1" : "icon-eye");
  const iptType = isPwd ? "password" : "text";
  //输入的密码如果符合正则，下一步按钮切换为启动状态
  const validator = (rule, value, callback) => {
    const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
    let isDisabled = true;
    if (reg.test(value)) {
      isDisabled = false;
    }
    setDisabled(isDisabled);
    callback();
  };
  //切换图标状态
  const switchIcon = () => {
    setciphertext(!ciphertext);
    setPwd(!isPwd);
  };
  return (
    <div className="password">
      <NavBar
        mode="light"
        icon={<Icon className="icon-left" type="left" />}
        onLeftClick={() => this.props.history.goBack()}
      >
        硅谷注册
      </NavBar>
      <WingBlank size="lg">
        <img src={msg} alt="msg" className="password-img" />
        <p className="password-msg">请设置登录密码</p>
        <InputItem
          {...getFieldProps("password", {
            rules: [{ validator }],
          })}
          clear
          type={iptType}
          placeholder="请设置8-20位登录密码"
          extra={<span className={iconClass} onTouchEnd={switchIcon}></span>}
        />
        <p className="password-text">
          密码由8-20位字母、数字或半角符号组成，不能是10位以下纯数字/字母/半角符号，字母需区分大小写
        </p>
        <WingBlank size="lg">
          <Button type="warning" disabled={isDisabled} className="warning-btn">
            下一步
          </Button>
        </WingBlank>
        <div className="password-question">
          <span>遇到问题？请</span>
          <Link className="password-question-link" to="/">
            联系客服
          </Link>
        </div>
      </WingBlank>
    </div>
  );
}
export default createForm()(VerifyPassword);

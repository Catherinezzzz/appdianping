import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getPassword,
  getUsername,
  isLogin,
  actions as loginActions,
} from "../../redux/modules/login";
import LoginForm from "./components/LoginForm";
import LoginHeader from "./components/LoginHeader";

import { Redirect } from "react-router-dom";

class Login extends Component {
  render() {
    const {
      username,
      password,
      login,
      location: { state },
    } = this.props;
    if (login) {
      if (state && state.from) {
        // 重定向到登录之前的那个页面
        return <Redirect to={state.from}></Redirect>;
      }
      // 已经登录，重定向到个人中心页
      return <Redirect to="/user"></Redirect>;
    }
    return (
      <div>
        <LoginHeader></LoginHeader>
        <LoginForm
          username={username}
          password={password}
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
        ></LoginForm>
      </div>
    );
  }

  // input元素改变的响应函数
  handleChange = (e) => {
    if (e.target.name === "username") {
      this.props.loginActions.setUsername(e.target.value);
    } else if (e.target.name === "password") {
      this.props.loginActions.setPassword(e.target.value);
    }
  };

  // 提交表单触发的函数
  handleSubmit = () => {
    this.props.loginActions.login();
  };
}

const mapStateToProps = (state) => {
  return {
    username: getUsername(state),
    password: getPassword(state),
    login: isLogin(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loginActions: bindActionCreators(loginActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { isLogin } from "../../redux/modules/login";

// 封装Route，根据登录状态判断是否渲染对应组件
class PrivateRoute extends Component {
  render() {
    const { component: Component, login, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={(props) => {
          return login ? (
            <Component {...props}></Component>
          ) : (
            <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
            ></Redirect>
          );
        }}
      ></Route>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    login: isLogin(state),
  };
};

export default connect(mapStateToProps, null)(PrivateRoute);

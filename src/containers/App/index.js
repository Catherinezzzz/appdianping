import "./style.css";
import ErrorToast from "../../components/ErrorToast";
import { actions as appActions, getError } from "../../redux/modules/app";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Home from "../Home";

import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ProductDetail from "../ProductDetail";
import Search from "../Search";
import SearchResult from "../SearchResult";
import Login from "../Login";
import User from "../User";
import Purchase from "../Purchase";
import PrivateRoute from "../PrivateRoute";

class App extends Component {
  render() {
    const {
      error,
      appActions: { clearError },
    } = this.props;
    return (
      <div className="App">
        <Router basename="/dianping">
          <Switch>
            <Route path="/detail/:id" component={ProductDetail}></Route>
            <Route path="/search" component={Search}></Route>
            <Route path="/search_result" component={SearchResult}></Route>
            <Route path="/login" component={Login}></Route>
            <PrivateRoute
              path="/purchase/:id"
              component={Purchase}
            ></PrivateRoute>
            <PrivateRoute path="/user" component={User}></PrivateRoute>
            <Route path="/" component={Home}></Route>
          </Switch>
          {/* 当error存在的时候才去渲染errorToast */}
          {error ? (
            <ErrorToast msg={error} clearError={clearError}></ErrorToast>
          ) : null}
        </Router>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    error: getError(state),
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    // redux提供的bindActionCreators方法
    // 将action进行进一步包装，这样在容器型组件中使用的时候直接发送对应的action，而不需要再调用dispatch发送action
    appActions: bindActionCreators(appActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

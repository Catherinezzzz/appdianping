import React, { Component } from "react";
import "./style.css";

class ErrorToast extends Component {
  render() {
    const { msg } = this.props;
    return (
      <div className="errorToast">
        <div className="errorToast__text">{msg}</div>
      </div>
    );
  }
  // 3秒之后重置错误信息（让它消失）
  componentDidMount() {
    this.timer = setTimeout(() => {
      this.props.clearError();
    }, 3000);
  }

  // 因为在组件上挂载了timer，卸载的时候要清除掉
  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
}

export default ErrorToast;

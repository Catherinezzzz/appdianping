import React, { Component } from "react";
import "./style.css";

class OrderItem extends Component {
  render() {
    const {
      data: { title, statusText, orderPicUrl, channel, text, type, commentId },
      isCommenting,
    } = this.props;
    return (
      <div className="orderItem">
        <div className="orderItem__title">
          <span>{title}</span>
        </div>
        <div className="orderItem__main">
          <div className="orderItem__imgWrapper">
            <div className="orderItem__tag">{statusText}</div>
            <img className="orderItem__img" src={orderPicUrl} alt=""></img>
          </div>
          <div className="orderItem__content">
            <div className="orderItem__line">{text[0]}</div>
            <div className="orderItem__line">{text[1]}</div>
          </div>
        </div>
        <div className="orderItem__bottom">
          <div className="orderItem__type">{channel}</div>
          <div>
            {/* 已消费的订单且未评价过才可以进行评价 */}
            {type === 1 && !commentId ? (
              <div className="orderItem__btn" onClick={this.handleComment}>
                评价
              </div>
            ) : null}
            <div className="orderItem__btn" onClick={this.handleRemove}>
              删除
            </div>
          </div>
        </div>
        {/* 当前订单处于评价状态，渲染评论区域 */}
        {isCommenting ? this.renderEditArea() : null}
      </div>
    );
  }

  // 删除订单
  handleRemove = () => {
    this.props.onRemove();
  };

  // 渲染评价区域
  renderEditArea = () => {
    return (
      <div className="orderItem__commentContainer">
        <textarea
          className="orderItem__comment"
          onChange={this.handleCommentChange}
          value={this.props.comment}
        ></textarea>
        {this.renderStars()}
        <button
          className="orderItem__commentBtn"
          onClick={this.props.onSubmitComment}
        >
          提交
        </button>
        <button
          className="orderItem__commentBtn"
          onClick={this.props.onCancelComment}
        >
          取消
        </button>
      </div>
    );
  };

  // 渲染评论区域打分部分
  renderStars = () => {
    const { stars } = this.props;
    return (
      <div>
        {[1, 2, 3, 4, 5].map((item, index) => {
          // 暂时模拟为3星
          const lightClass = stars >= item ? "orderItem__star--light" : "";
          return (
            // 点击星星可以获得星级信息
            <span
              className={"orderItem__star " + lightClass}
              key={index}
              onClick={this.props.onStarsChange.bind(this, item)}
            >
              ★
            </span>
          );
        })}
      </div>
    );
  };

  // 评论区域onchange事件
  handleCommentChange = (e) => {
    this.props.onCommentChange(e.target.value);
  };

  // 评价按钮被点击
  handleComment = () => {
    const {
      data: { id },
    } = this.props;

    this.props.onComment(id);
  };
}

export default OrderItem;

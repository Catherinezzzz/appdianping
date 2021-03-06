import React, { Component } from "react";
import "./style.css";

class PurchaseForm extends Component {
  render() {
    const { quantity, phone, totalPrice } = this.props;
    // const totalPrice = (currentPrice * quantity).toFixed(1);
    return (
      <div className="purchaseForm">
        <div className="purchaseForm__wrapper">
          <div className="purchaseForm__row">
            <div className="purchaseForm__rowLabel">数量</div>
            <div className="purchaseForm__rowValue purchaseForm__quantityGroup">
              <span
                className="purchaseForm__counter--dec"
                onClick={this.handleDecrease}
              >
                -
              </span>
              <input
                className="purchaseForm__quantity"
                onChange={this.handleChange}
                value={quantity}
              ></input>
              <span
                className="purchaseForm__counter--inc"
                onClick={this.handleIncrease}
              >
                +
              </span>
            </div>
          </div>

          <div className="purchaseForm__row">
            <div className="purchaseForm__rowLabel">小计</div>
            <div className="purchaseForm__rowValue">
              <span className="purchase__totalPrice">￥{totalPrice}</span>
            </div>
          </div>

          <div className="purchaseForm__row">
            <div className="purchaseForm__rowLabel">手机号码</div>
            <div className="purchaseForm__rowValue">{phone}</div>
          </div>
        </div>

        <ul className="purchaseForm__remark">
          <li className="purchaseForm__remarkItem">
            <i className="purchaseForm__sign"></i>
            <span className="purchaseForm__desc">支持随时退</span>
          </li>
          <li className="purchaseForm__remarkItem">
            <i className="purchaseForm__sign"></i>
            <span className="purchaseForm__desc">支持过期退</span>
          </li>
        </ul>

        <a className="purchaseForm__submit" onClick={this.handleClick}>
          提交订单
        </a>
      </div>
    );
  }

  handleDecrease = () => {
    const { quantity } = this.props;
    if (quantity > 1) {
      this.props.onSetQuantity(quantity - 1);
    } else {
      return;
    }
  };

  handleIncrease = () => {
    const { quantity } = this.props;
    this.props.onSetQuantity(quantity + 1);
  };

  handleChange = (e) => {
    const quantity = e.target.value;
    this.props.onSetQuantity(Number.parseInt(quantity));
  };

  handleClick = () => {
    const { quantity } = this.props;
    if (quantity > 0) {
      this.props.onSubmit();
    }
  };
}

export default PurchaseForm;

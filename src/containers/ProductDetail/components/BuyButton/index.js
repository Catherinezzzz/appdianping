import React, { Component } from "react";
import "./style.css";
import { Link } from "react-router-dom";

class BuyButton extends Component {
  render() {
    const { productId } = this.props;
    return (
      <Link className="buyButton" to={`/purchase/${productId}`}>
        立即购买
      </Link>
    );
  }
}

export default BuyButton;

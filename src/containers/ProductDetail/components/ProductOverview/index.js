// 商品详情页-商品概览模块

import React, { Component } from "react";
import "./style.css";
import { Link } from "react-router-dom";

class ProductOverview extends Component {
  render() {
    const { id, shop, picture, description, currentPrice, oldPrice } =
      this.props.data;
    return (
      <div className="productOverview">
        <div className="productOverview__header">
          <div className="productOverview__imgContainer">
            <img alt="" src={picture} className="productOverview__img"></img>
          </div>
          <div className="productOverview__baseInfo">
            <div className="productOverview__title">{shop}</div>
            <div className="productOverview__content">{description}</div>
          </div>
        </div>
        <div className="productOverview__purchase">
          <span className="productOverview__symbol">￥</span>
          <span className="productOverview__price">{currentPrice}</span>
          <span className="productOverview__price--old">￥{oldPrice}</span>
          <Link className="productOverview__btn" to={`/purchase/${id}`}>
            立即购买
          </Link>
        </div>
        <ul className="productOverview__remark">
          <li className="productOverview__remarkItem">
            <i className="productOverview__sign1"></i>
            <span className="productOverview__desc">随时可退</span>
          </li>
          <li className="productOverview__remarkItem">
            <i className="productOverview__sign2"></i>
            <span className="productOverview__desc">过期自动退</span>
          </li>
        </ul>
      </div>
    );
  }
}

export default ProductOverview;

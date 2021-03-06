import React, { Component } from "react";
import "./style.css";

class Detail extends Component {
  render() {
    const {
      detail: { category, products, remark },
      currentPrice,
      oldPrice,
    } = this.props.data;
    return (
      <div className="detail">
        <div className="detail__header">
          <span>团购详情</span>
          <i className="detail__headerIcon"></i>
        </div>
        <table className="detail__table" cellPadding="0" cellSpacing="0">
          <tbody>
            <tr className="detail__row">
              <th colSpan="3" className="detail__category">
                {category}
              </th>
            </tr>
            {products.map((item, index) => {
              return (
                <tr className="detail__row" key={index}>
                  <td>{item.name}</td>
                  <td className="detail__td--alignRight">{item.quantity}</td>
                  <td className="detail__td--alignRight">{item.price}</td>
                </tr>
              );
            })}
            <tr className="detail__row">
              <td></td>
              <td className="detail__td--price">
                最高价格 <br />
                <strong className="detail__td--priceNew">团购价</strong>
              </td>
              <td className="detail__td--price">
                {oldPrice}元 <br />
                <strong className="detail__td--priceNew">
                  {currentPrice}元
                </strong>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="detail__remark">{remark}</div>
        <div className="detail__more">
          <span>更多图文详情</span>
          <span className="detail__notice">（建议Wifi环境下打开）</span>
          <i className="detail__arrow"></i>
        </div>
      </div>
    );
  }
}

export default Detail;

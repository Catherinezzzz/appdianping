import React, { Component } from "react";
import "./style.css";

// const data = [
//   "三里屯",
//   "西单",
//   "朝阳大悦城",
//   "火锅",
//   "烤鸭",
//   "星巴克",
//   "温泉",
//   "王府井",
//   "国贸",
// ];

class PopularSearch extends Component {
  render() {
    const { data } = this.props;
    return (
      <div className="popularSearch">
        {data.map((item) => {
          return (
            <span
              key={item.id}
              className="popularSearch__item"
              onClick={this.handleClick.bind(this, item)}
            >
              {item.keyword}
            </span>
          );
        })}
      </div>
    );
  }
  handleClick = (item) => {
    this.props.onClickItem(item);
  };
}

export default PopularSearch;

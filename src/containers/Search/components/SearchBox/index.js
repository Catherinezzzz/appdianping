import React, { Component } from "react";
import "./style.css";

// const data = [
//   {
//     id: 1,
//     keyword: "火锅",
//     quantity: 8710,
//   },
//   {
//     id: 2,
//     keyword: "火锅自助",
//     quantity: 541,
//   },
//   {
//     id: 3,
//     keyword: "火锅 三里屯",
//     quantity: 65,
//   },
//   {
//     id: 4,
//     keyword: "火锅 望京",
//     quantity: 133,
//   },
//   {
//     id: 5,
//     keyword: "火锅家常菜",
//     quantity: 179,
//   },
// ];

class SearchBox extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     inputText: "",
  //   };
  // }

  render() {
    const { inputText, relatedKeywords } = this.props;
    return (
      <div className="searchBox">
        <div className="searchBox__container">
          <input
            className="searchBox__text"
            value={inputText}
            onChange={this.handleChange}
          ></input>
          <span className="searchBox__clear" onClick={this.handleClear}></span>
          <span className="searchBox__cancel" onClick={this.handleCancel}>
            取消
          </span>
        </div>
        {relatedKeywords.length > 0 ? this.renderSuggestList() : null}
      </div>
    );
  }

  // 输入框中输入文字时显示关联关键词列表
  renderSuggestList() {
    return (
      <ul className="searchBox__list">
        {this.props.relatedKeywords.map((item) => {
          return (
            <li
              key={item.id}
              className="searchBox__item"
              onClick={this.handleClickItem.bind(this, item)}
            >
              <span className="serachBox__itemKeyword">{item.keyword}</span>
              <span className="searchBox__itemQuantity">
                约{item.quantity}个结果
              </span>
            </li>
          );
        })}
      </ul>
    );
  }
  handleChange = (e) => {
    this.props.onChange(e.target.value);
  };

  handleClear = () => {
    this.props.onClear();
  };

  handleCancel = () => {
    this.props.onCancel();
  };

  handleClickItem = (item) => {
    this.props.onClickItem(item);
  };
}

export default SearchBox;

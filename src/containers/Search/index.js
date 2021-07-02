import React, { Component } from "react";
import SearchBox from "./components/SearchBox";
import PopularSearch from "./components/PopularSearch";
import SearchHistory from "./components/SearchHistory";

import { bindActionCreators } from "redux";
import {
  actions as searchActions,
  getPopularKeywords,
  getRelatedKeywords,
  getInputText,
  getHistoryKeywords,
} from "../../redux/modules/search";
import { connect } from "react-redux";

class Search extends Component {
  render() {
    const { inputText, relatedKeywords, popularKeywords, historyKeywords } =
      this.props;
    return (
      <div>
        <SearchBox
          inputText={inputText}
          relatedKeywords={relatedKeywords}
          onChange={this.handleChangeInput}
          onClear={this.handleClearInput}
          onCancel={this.handleCancel}
          onClickItem={this.handleClickItem}
        ></SearchBox>
        <PopularSearch
          data={popularKeywords}
          onClickItem={this.handleClickItem}
        ></PopularSearch>
        <SearchHistory
          data={historyKeywords}
          onClickItem={(this, this.handleClickItem)}
          onClear={this.handleClearHistory}
        ></SearchHistory>
      </div>
    );
  }
  componentDidMount() {
    // 第一次进入页面，要抓取热门搜索词
    const { loadPopularKeywords } = this.props.searchActions;
    loadPopularKeywords();
  }

  // 搜索框文本发生变化
  handleChangeInput = (text) => {
    const { setInputText, loadRelatedKeywords } = this.props.searchActions;
    setInputText(text);
    loadRelatedKeywords(text);
  };

  // 清除搜索框文本
  handleClearInput = () => {
    const { clearInputText } = this.props.searchActions;
    clearInputText();
  };

  // 取消搜索
  handleCancel = () => {
    this.handleClearInput();
    // 退回到上一个页面
    this.props.history.goBack();
  };

  // 处理点击关键词的逻辑
  handleClickItem = (item) => {
    const { setInputText, addHistoryKeywords, loadRelatedShops } =
      this.props.searchActions;
    setInputText(item.keyword);
    addHistoryKeywords(item.id);
    // 触发查询请求，查询店铺列表
    loadRelatedShops(item.id);
    // 跳转搜索结果页逻辑
    this.props.history.push("/search_result");
  };

  // 清除历史记录
  handleClearHistory = () => {
    const { clearHistoryKeywords } = this.props.searchActions;
    clearHistoryKeywords();
  };

  // 组件被卸载，要清空输入框内容
  componentWillUnmount() {
    const { clearInputText } = this.props.searchActions;
    clearInputText();
  }
}

const mapStateToProps = (state, props) => {
  return {
    relatedKeywords: getRelatedKeywords(state),
    inputText: getInputText(state),
    popularKeywords: getPopularKeywords(state),
    historyKeywords: getHistoryKeywords(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    searchActions: bindActionCreators(searchActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);

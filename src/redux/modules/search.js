// 搜索页相关的状态

import { combineReducers } from "redux";
import url from "../../utils/url";
import { FETCH_DATA } from "../middleware/api";
import { schema as keywordSchema, getKeywordById } from "./entities/keywords";
import { getShopById, schema as shopSchema } from "./entities/shops";

// 搜索页初始状态(后新增搜索结果页)
const initialState = {
  // 输入框文本信息
  inputText: "",
  // 热门关键词的id, 通过id到entities.keywords中查询
  popularKeyWords: {
    ids: [],
    isFetching: false,
  },
  // 根据输入框中输入的inputText去后台查询得到的关键词
  // 示例
  //   {
  //       '火锅': {
  //           isFetching: false,
  //           ids: []
  //       }
  //   }
  relatedKeywords: {},

  historyKeywords: [], // 保存关键词id

  // 搜索结果页新增的状态
  // 存放根据关键词搜索到的店铺信息
  // searchedShopsByKeywords示例
  //   {
  //       'keywordId': {
  //           isFetching: false,
  //           ids: []
  //       }
  //   }
  searchedShopsByKeyword: {},
};

// action Types
export const types = {
  // 获取热门关键词
  FETCH_POPULAR_KEYWORDS_REQUEST: "SEARCH/FETCH_POPULAR_KEYWORDS_REQUEST",
  FETCH_POPULAR_KEYWORDS_SUCCESS: "SEARCH/FETCH_POPULAR_KEYWORDS_SUCCESS",
  FETCH_POPULAR_KEYWORDS_FAILURE: "SEARCH/FETCH_POPULAR_KEYWORDS_FAILURE",

  // 根据输入文本获取相关的关键词
  FETCH_RELATED_KEYWORDS_REQUEST: "SEARCH/FETCH_RELATED_KEYWORDS_REQUEST",
  FETCH_RELATED_KEYWORDS_SUCCESS: "SEARCH/FETCH_RELATED_KEYWORDS_SUCCESS",
  FETCH_RELATED_KEYWORDS_FAILURE: "SEARCH/FETCH_RELATED_KEYWORDS_FAILURE",

  // 设置当前输入(不涉及网络请求)
  SET_INPUT_TEXT: "SEARCH/SET_INPUT_TEXT",
  CLEAR_INPUT_TEXT: "SEARCH/CLEAR_INPUT_TEXT",

  // 与历史记录相关的actiontype
  // 当输入关键词进行搜索时，需要把关键词添加到历史记录当中
  ADD_HISTORY_KEYWORDS: "SEARCH/ADD_HISTORY_KEYWORDS",
  CLEAR_HISTORY_KEYWORDS: "SEARCH/CLEAR_HISTORY_KEYWORDS",

  // 根据关键词查询店铺信息的actionTypes
  FETCH_SHOPS_REQUEST: "SEARCH/FETCH_SHOPS_REQUEST",
  FETCH_SHOPS_SUCCESS: "SEARCH/FETCH_SHOPS_SUCCESS",
  FETCH_SHOPS_FAILURE: "SEARCH/FETCH_SHOPS_FAILURE",
};

// 定义actionCreators
export const actions = {
  /**
   * 获取热门关键词
   */
  loadPopularKeywords: () => {
    return (dispatch, getState) => {
      // 检查id是否存在
      // 已经存在，代表已经发送过网络请求来获取数据
      const { ids } = getState().search.popularKeywords;
      // 利用redux作为缓存层的作用，不再向服务器端发送请求
      if (ids.length > 0) {
        return null;
      }
      // ids为空，向服务器端发送请求
      const endpoint = url.getPopularKeywords();
      return dispatch(fetchPopularKeywords(endpoint));
    };
  },

  /**
   * 根据输入获取相关关键词
   */
  loadRelatedKeywords: (text) => {
    return (dispatch, getState) => {
      const { relatedKeywords } = getState().search;
      if (relatedKeywords[text]) return null;
      const endpoint = url.getRelatedKeywords(text);
      return dispatch(fetchRelatedKeywords(text, endpoint));
    };
  },

  /**
   * 搜索框输入文本相关action
   * @param {*} text
   */
  setInputText: (text) => ({
    type: types.SET_INPUT_TEXT,
    text,
  }),

  /**
   * 清除输入框输入的文本的action
   */
  clearInputText: () => ({
    type: types.CLEAR_INPUT_TEXT,
  }),

  /**
   * 添加历史记录
   * @param {*} keywordId
   */
  addHistoryKeywords: (keywordId) => ({
    type: types.ADD_HISTORY_KEYWORDS,
    text: keywordId,
  }),

  /**
   * 清空历史记录
   */
  clearHistoryKeywords: () => ({
    type: types.CLEAR_HISTORY_KEYWORDS,
  }),

  // 定义搜索结果页需要的actionCreators
  /**
   * 根据关键词查询对应的店铺信息
   * @param {*} keyword
   * @returns
   */
  loadRelatedShops: (keyword) => {
    return (dispatch, getState) => {
      const { searchedShopsByKeyword } = getState().search;
      // 利用redux缓存层的作用
      if (searchedShopsByKeyword[keyword]) {
        return null;
      }
      const endpoint = url.getRelatedShops(keyword);
      return dispatch(fetchReletedShops(keyword, endpoint));
    };
  },
};

// 获取热门检索词的action
const fetchPopularKeywords = (endpoint) => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_POPULAR_KEYWORDS_REQUEST,
      types.FETCH_POPULAR_KEYWORDS_SUCCESS,
      types.FETCH_POPULAR_KEYWORDS_FAILURE,
    ],
    endpoint,
    schema: keywordSchema,
  },
});

// 获取与输入框内容相关的热门检索词的action
const fetchRelatedKeywords = (text, endpoint) => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_RELATED_KEYWORDS_REQUEST,
      types.FETCH_RELATED_KEYWORDS_SUCCESS,
      types.FETCH_RELATED_KEYWORDS_FAILURE,
    ],
    endpoint,
    schema: keywordSchema,
  },
  text,
});

// 根据输入的关键词请求相关店铺信息的action
const fetchReletedShops = (text, endpoint) => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_SHOPS_REQUEST,
      types.FETCH_SHOPS_SUCCESS,
      types.FETCH_SHOPS_FAILURE,
    ],
    endpoint,
    schema: shopSchema,
  },
  text,
});

// 子reducer

// 热门检索词的reducer
const popularKeywords = (state = initialState.popularKeyWords, action) => {
  switch (action.type) {
    case types.FETCH_POPULAR_KEYWORDS_REQUEST:
      return { ...state, isFetching: true };
    case types.FETCH_POPULAR_KEYWORDS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        ids: state.ids.concat(action.response.ids),
      };
    case types.FETCH_POPULAR_KEYWORDS_FAILURE:
      return { ...state, isFetching: false };
    default:
      return state;
  }
};

// 获取与输入框内容相关联的检索词的reducer
const relatedKeywords = (state = initialState.relatedKeywords, action) => {
  switch (action.type) {
    // state中，relatedKeyword的结构比较复杂，有两层嵌套，要先把最内层的数据取出来
    case types.FETCH_RELATED_KEYWORDS_REQUEST:
    case types.FETCH_RELATED_KEYWORDS_SUCCESS:
    case types.FETCH_RELATED_KEYWORDS_FAILURE:
      // 使用relatedKeywordsByText函数处理嵌套层级过深的state
      return {
        ...state,
        [action.text]: relatedKeywordsByText(state[action.text], action),
      };
    default:
      return state;
  }
};

// input相关的子reducer
const inputText = (state = initialState.inputText, action) => {
  switch (action.type) {
    case types.SET_INPUT_TEXT:
      return action.text;

    case types.CLEAR_INPUT_TEXT:
      return "";

    default:
      return state;
  }
};

// historyKeyword的子reducer
const historyKeywords = (state = initialState.historyKeywords, action) => {
  switch (action.type) {
    case types.ADD_HISTORY_KEYWORDS:
      // 注意新增的关键词是否已经在历史记录中存在
      const data = state.filter((item) => {
        if (item !== action.text) {
          return true;
        }
        return false;
      });
      return [action.text, ...data];
    case types.CLEAR_HISTORY_KEYWORDS:
      return { ...state, historyKeywords: [] };
    default:
      return state;
  }
};

// 获取与检索词相关店铺信息的reducer
const searchedShopsByKeyword = (
  state = initialState.searchedShopsByKeyword,
  action
) => {
  switch (action.type) {
    // state中，searchedShopsByKeyword的结构比较复杂，有两层嵌套，要先把最内层的数据取出来
    case types.FETCH_SHOPS_REQUEST:
    case types.FETCH_SHOPS_SUCCESS:
    case types.FETCH_SHOPS_FAILURE:
      // 使用searchedShops函数处理嵌套层级过深的state
      return {
        ...state,
        [action.text]: searchedShops(state[action.text], action),
      };
    default:
      return state;
  }
};

// 处理搜索页复杂嵌套的state
const relatedKeywordsByText = (
  state = { isFetching: false, ids: [] },
  action
) => {
  switch (action.type) {
    case types.FETCH_RELATED_KEYWORDS_REQUEST:
      return { ...state, isFetching: true };
    case types.FETCH_RELATED_KEYWORDS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        ids: state.ids.concat(action.response.ids),
      };
    case types.FETCH_RELATED_KEYWORDS_FAILURE:
      return { ...state, isFetching: false };
    default:
      return state;
  }
};

// 处理搜索结果页中复杂的state
const searchedShops = (state = { isFetching: false, ids: [] }, action) => {
  switch (action.type) {
    case types.FETCH_SHOPS_REQUEST:
      return { ...state, isFetching: true };
    case types.FETCH_SHOPS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        ids: action.response.ids,
      };
    case types.FETCH_SHOPS_FAILURE:
      return { ...state, isFetching: false };
    default:
      return state;
  }
};

const reducer = combineReducers({
  popularKeywords,
  relatedKeywords,
  inputText,
  historyKeywords,
  searchedShopsByKeyword,
});
export default reducer;

// selector函数
export const getPopularKeywords = (state) => {
  // 正常获取
  return state.search.popularKeywords.ids.map((id) => {
    return getKeywordById(state, id);
  });
};

export const getRelatedKeywords = (state) => {
  // 当前输入框中的文本信息
  const text = state.search.inputText;
  if (!text || text.trim().length === 0) {
    return [];
  }

  const relatedKeywords = state.search.relatedKeywords[text];
  if (!relatedKeywords) return [];
  return relatedKeywords.ids.map((id) => {
    return getKeywordById(state, id);
  });
};

export const getInputText = (state) => {
  return state.search.inputText;
};

export const getHistoryKeywords = (state) => {
  return state.search.historyKeywords.map((id) => {
    return getKeywordById(state, id);
  });
};

// 获取检索词对应的店铺
export const getSearchedShops = (state) => {
  // 当前检索使用的关键词
  const keywordId = state.search.historyKeywords[0];
  if (!keywordId) return [];
  const shops = state.search.searchedShopsByKeyword[keywordId];
  return shops.ids.map((id) => {
    return getShopById(state, id);
  });
};

// 获取当前检索关键词
export const getCurrentKeyword = (state) => {
  const keywordId = state.search.historyKeywords[0];
  if (!keywordId) return "";
  return getKeywordById(state, keywordId).keyword;
};

// 首页所有状态
import { combineReducers } from "redux";
// import { get } from "../../utils/request";
import url from "../../utils/url.js";
import { FETCH_DATA } from "../middleware/api";
import { schema } from "./entities/products";

// 请求参数使用到的常量
export const params = {
  // 获取[猜你喜欢]数据要用到的路径
  PATH_LIKES: "likes",
  // 获取[特惠商品]数据要用到的路径
  PATH_DISCOUNTS: "discounts",
  // [猜你喜欢]每次加载获取5条数据
  LIKES_PAGE_SIZE: 5,
  // [特惠商品]只需要固定获取3条数据
  DISCOUNTS_PAGE_SIZE: 3,
};

// 定义首页所有的actionTypes
export const types = {
  // 定义与 [猜你喜欢] 获取商品列表的actionTypes
  FETCH_LIKES_REQUEST: "HOME/FETCH_LIKES_REQUEST",
  FETCH_LIKES_SUCCESS: "HOME/FETCH_LIKES_SUCCESS",
  FETCH_LIKES_FAILURE: "HOME/FETCH_LIKES_FAILURE",
  // 定义与 [特惠商品] 获取商品列表的actionTypes
  FETCH_DISCOUNTS_REQUEST: "HOME/FETCH_DISCOUNTS_REQUEST",
  FETCH_DISCOUNTS_SUCCESS: "HOME/FETCH_DISCOUNTS_SUCCESS",
  FETCH_DISCOUNTS_FAILURE: "HOME/FETCH_DISCOUNTS_FAILURE",
};

// 初始状态包括两块：猜你喜欢相关state + 特惠商品相关state
const initState = {
  likes: {
    isFetching: false,
    // [猜你喜欢]当前获取数据的页码
    pageCount: 0,
    // 保存[猜你喜欢]中每一个商品的id
    // 具体的商品信息可以通过products模块获取到
    ids: [],
  },
  discounts: {
    isFetching: false,
    ids: [],
  },
};

// 定义首页中所有生成函数的actionCreators
export const actions = {
  // action--loadLikes : 加载[猜你喜欢]的数据
  loadLikes: () => {
    return (dispatch, getState) => {
      // 当前加载的页码数
      const { pageCount } = getState().home.likes;
      // 下次加载的起始位置
      const rowIndex = pageCount * params.LIKES_PAGE_SIZE;
      const endpoint = url.getProductList(
        params.PATH_LIKES,
        rowIndex,
        params.LIKES_PAGE_SIZE
      );
      return dispatch(fetchLikes(endpoint));
    };
  },
  // action--loadDiscounts : 加载[特惠商品]的数据
  loadDiscounts: () => {
    return (dispatch, getState) => {
      // 已经加载过超值特惠的数据，不需要重新发送请求获取数据
      const { ids } = getState().home.discounts;
      if (ids.length > 0) {
        return null;
      }
      const endpoint = url.getProductList(
        params.PATH_DISCOUNTS,
        0,
        params.DISCOUNTS_PAGE_SIZE
      );
      return dispatch(fetchDiscounts(endpoint));
    };
  },

  // // 获取 [猜你喜欢] 商品列表的action
  // loadLikes: () => {
  //   return (dispatch, getState) => {
  //     // 请求即将开始发送
  //     dispatch(fetchLikesRequest);
  //     return get(url.getProductList(0, 10)).then(
  //       (data) => {
  //         dispatch(fetchLikesSuccess(data));
  //       },
  //       (err) => {
  //         dispatch(fetchLikesFailure(err));
  //       }
  //     );
  //   };
  // },
};

/**
 * [猜你喜欢]板块的action，封装好中间件后使用的，能够同时处理发送请求、请求成功、请求失败的action，合并成一个，不需要分为三个action
 * @param {*} endpoint
 * @returns
 */
const fetchLikes = (endpoint) => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_LIKES_REQUEST,
      types.FETCH_LIKES_SUCCESS,
      types.FETCH_LIKES_FAILURE,
    ],
    endpoint,
    schema,
  },
});

const fetchDiscounts = (endpoint) => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_DISCOUNTS_REQUEST,
      types.FETCH_DISCOUNTS_SUCCESS,
      types.FETCH_DISCOUNTS_FAILURE,
    ],
    endpoint,
    schema,
  },
});

// // fetchLikesRequest， fetchLikesSuccess， fetchLikesFailure
// // 对应 [猜你喜欢] 板块，发送请求获取列表数据、请求数据成功、请求数据失败的action
// const fetchLikesRequest = () => ({
//   type: types.FETCH_LIKES_REQUEST,
// });
// const fetchLikesSuccess = (data) => ({
//   type: types.FETCH_LIKES_SUCCESS,
//   data,
// });
// const fetchLikesFailure = (error) => ({
//   type: types.FETCH_LIKES_FAILURE,
//   error,
// });

// [猜你喜欢] 的子reducer
const likes = (state = initState.likes, action) => {
  switch (action.type) {
    case types.FETCH_LIKES_REQUEST:
      return { ...state, isFetching: true };
    case types.FETCH_LIKES_SUCCESS:
      return {
        ...state,
        isFetching: false,
        pageCount: state.pageCount + 1,
        ids: state.ids.concat(action.response.ids),
      };
    case types.FETCH_LIKES_FAILURE:
      return { ...state, isFetching: false };
    default:
      return state;
  }
};

// [超值特惠] 的子reducer
const discounts = (state = initState.discounts, action) => {
  switch (action.type) {
    case types.FETCH_DISCOUNTS_REQUEST:
      return { ...state, isFetching: true };
    case types.FETCH_DISCOUNTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        ids: state.ids.concat(action.response.ids),
      };
    case types.FETCH_DISCOUNTS_FAILURE:
      return { ...state, isFetching: false };
    default:
      return state;
  }
};

// home首页的所有reducer
const reducer = combineReducers({ likes, discounts });

export default reducer;

// selector函数
export const getLikes = (state) => {
  return state.home.likes.ids.map((id) => {
    return state.entities.products[id];
  });
};

export const getDiscounts = (state) => {
  return state.home.discounts.ids.map((id) => {
    return state.entities.products[id];
  });
};

// 获取 [猜你喜欢] 当前的页码数
export const getPageCountOfLikes = (state) => {
  return state.home.likes.pageCount;
};

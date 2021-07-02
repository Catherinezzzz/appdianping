// 商品详情页状态
import url from "../../utils/url.js";
import { FETCH_DATA } from "../middleware/api";
import { getShopById, schema as shopSchema } from "./entities/shops";
import {
  getProductById,
  getProductDetail,
  schema as productSchema,
} from "./entities/products";
import { combineReducers } from "redux";

// 初始state
const initialState = {
  products: {
    isFetching: false,
    id: null,
  },
  relatedShops: {
    isFetching: false,
    id: null,
  },
};

// actionTypes: 包含获取商品详情的actionTypes + 获取关联店铺信息的actionTypes
// 这两组action都是通过调用后台API来获取对应的领域实体数据的。
export const types = {
  // 获取商品详情的action Types
  FETCH_PRODUCT_DETAIL_REQUEST: "DETAIL/FETCH_PRODUCT_DETAIL_REQUEST",
  FETCH_PRODUCT_DETAIL_SUCCESS: "DETAIL/FETCH_PRODUCT_DETAIL_SUCCESS",
  FETCH_PRODUCT_DETAIL_FAILURE: "DETAIL/FETCH_PRODUCT_DETAIL_FAILURE",

  // 获取关联店铺信息的actionTypes
  FETCH_SHOP_REQUEST: "DETAIL/FETCH_SHOP_REQUEST",
  FETCH_SHOP_SUCCESS: "DETAIL/FETCH_SHOP_SUCCESS",
  FETCH_SHOP_FAILURE: "DETAIL/FETCH_SHOP_FAILURE",
};

// actionCreators
export const actions = {
  // 获取商品详情
  loadProductDetail: (id) => {
    return (dispatch, getState) => {
      // 利用Redux的中间缓存层的作用
      // 如果对应商品已经在Redux的State中存在，就不需要发送网络请求
      const product = getProductDetail(getState(), id);
      if (product) {
        return dispatch(fetchProductDetailSuccess(id));
      }
      const endpoint = url.getProductDetail(id);
      return dispatch(fetchProductDetail(endpoint, id));
    };
  },
  // 获取商品相关联的店铺信息
  loadShopById: (id) => {
    return (dispatch, getState) => {
      // 利用Redux的中间缓存层的作用
      const shop = getShopById(getState(), id);
      if (shop) {
        return dispatch(fetchShopSuccess(id));
      }
      const endpoint = url.getShopById(id);
      return dispatch(fetchShopById(endpoint, id));
    };
  },
};

// 获取商品详情数据的actionCreator
const fetchProductDetail = (endpoint, id) => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_PRODUCT_DETAIL_REQUEST,
      types.FETCH_PRODUCT_DETAIL_SUCCESS,
      types.FETCH_PRODUCT_DETAIL_FAILURE,
    ],
    endpoint,
    schema: productSchema,
  },
  id,
});
// 获取关联店铺信息的actionCreators
const fetchShopById = (endpoint, id) => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_SHOP_REQUEST,
      types.FETCH_SHOP_SUCCESS,
      types.FETCH_SHOP_FAILURE,
    ],
    endpoint,
    schema: shopSchema,
  },
  id,
});

const fetchProductDetailSuccess = (id) => ({
  type: types.FETCH_PRODUCT_DETAIL_SUCCESS,
  id,
});

const fetchShopSuccess = (id) => ({
  type: types.FETCH_SHOP_SUCCESS,
  id,
});

// 商品详情的reducer
const product = (state = initialState.products, action) => {
  switch (action.type) {
    case types.FETCH_PRODUCT_DETAIL_REQUEST:
      return { ...state, isFetching: true };
    case types.FETCH_PRODUCT_DETAIL_SUCCESS:
      return { ...state, id: action.id, isFetching: false };
    case types.FETCH_PRODUCT_DETAIL_FAILURE:
      return { ...state, isFetching: false, id: null };
    default:
      return state;
  }
};
// 关联店铺的reducer
const relatedshop = (state = initialState.relatedShops, action) => {
  switch (action.type) {
    case types.FETCH_SHOP_REQUEST:
      return { ...state, isFetching: true };
    case types.FETCH_SHOP_SUCCESS:
      return { ...state, id: action.id, isFetching: false };
    case types.FETCH_SHOP_FAILURE:
      return { ...state, isFetching: false, id: null };
    default:
      return state;
  }
};

const reducer = combineReducers({ product, relatedshop });

export default reducer;

// selectors函数
// 获取商品详情信息
export const getProduct = (state, id) => {
  return getProductDetail(state, id);
};

// 获取关联的店铺信息
export const getRelatedShop = (state, productId) => {
  const product = getProductById(state, productId);
  // product存在时，获取关联店铺信息才有意义
  // let shopId = product ? product.nearestShop : null;
  let shopId = product ? product.shopIds[0] : null;
  if (shopId) {
    return getShopById(state, shopId);
  } else {
    return null;
  }
};

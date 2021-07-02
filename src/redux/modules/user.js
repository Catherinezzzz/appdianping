import { combineReducers } from "redux";

import url from "../../utils/url";
import { FETCH_DATA } from "../middleware/api";
import {
  schema,
  TO_PAY_TYPE,
  AVAILABLE_TYPE,
  REFUND_TYPE,
  getOrderById,
  actions as orderActions,
  types as orderTypes,
} from "./entities/orders";
import { actions as commentActions } from "./entities/comments";

const typeToKey = {
  [TO_PAY_TYPE]: "toPayIds",
  [AVAILABLE_TYPE]: "availableIds",
  [REFUND_TYPE]: "refundIds",
};

const initialState = {
  orders: {
    isFetching: false,
    fetched: false, // 订单页面是否真正抓取过数据
    ids: [],
    toPayIds: [], // 待付款的订单ids
    availableIds: [], // 可使用的订单ids
    refundIds: [], // 退款订单ids
  },
  currentTab: 0, // 订单页哪一个tab处于选中状态
  currentOrder: {
    id: null,
    idDeleting: false,
    isCommenting: false, // 当前订单是否处于被评论状态
    comment: "", // 具体的评价内容
    stars: 0, // 评价的打分情况
  }, // 当前处理的订单是哪一个，删除订单时使用
};

// actionTypes
export const types = {
  // 获取订单列表的actionTypes
  FETCH_ORDERS_REQUEST: "USER/FETCH_ORDERS_REQUEST",
  FETCH_ORDERS_SUCCESS: "USER/FETCH_ORDERS_SUCCESS",
  FETCH_ORDERS_FAILURE: "USER/FETCH_ORDERS_FAILURE",

  // 设置当前选中的tab的actionType
  SET_CURRENT_TAB: "USER/SET_CURRENT_TAB",

  // 删除订单的actionTypes
  DELETE_ORDER_REQUEST: "USER/DELETE_ORDER_REQUEST",
  DELETE_ORDER_SUCCESS: "USER/DELETE_ORDER_SUCCESS",
  DELETE_ORDER_FAILURE: "USER/DELETE_ORDER_FAILURE",

  // 标识当前删除订单的对话框是否显示的actionType
  SHOW_DELETE_DIALOG: "USER/SHOW_DELETE_DIALOG",
  HIDE_DELETE_DIALOG: "USER/HIDE_DELETE_DIALOG",

  // 控制订单评价区域是否显示的actionType
  SHOW_COMMENT_AREA: "USER/SHOW_COMMENT_AREA",
  HIDE_COMMENT_AREA: "USER/HIDE_COMMENT_AREA",

  // 设置评价内容的actionTye
  SET_COMMENT: "USER/SET_COMMENT",

  // 控制评价星级的actionType
  SET_STARS: "USER/SET_STARS",

  // 提交评价的actionType
  POST_COMMENT_REQUEST: "USER/POST_COMMENT_REQUEST",
  POST_COMMENT_SUCCESS: "USER/POST_COMMENT_SUCCESS",
  POST_COMMENT_FAILURE: "USER/POST_COMMENT_FAILURE",
};

// action creators
export const actions = {
  // 获取订单列表的action
  loadOrders: () => {
    return (dispatch, getState) => {
      // 利用redux的缓存作用
      const { fetched } = getState().user.orders;
      if (fetched) {
        return null;
      }
      const endpoint = url.getOrders();
      return dispatch(fetchOrders(endpoint));
    };
  },

  // 更改currentTab的action
  setCurrentTab: (index) => ({
    type: types.SET_CURRENT_TAB,
    index,
  }),

  // 删除订单的action
  removeOrder: () => {
    return (dispatch, getState) => {
      // 获取当前选中的订单id
      const { id } = getState().user.currentOrder;
      // id存在，执行删除
      if (id) {
        dispatch(deleteOrderRequest());
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            // 从user模块中删除订单id
            dispatch(deleteOrderSuccess(id));
            // 从orders模块中删除订单对象
            dispatch(orderActions.deleteOrder(id));
            resolve();
          }, 500);
        });
      }
    };
  },

  // 显示删除对话框的action
  showDeleteDialog: (orderId) => ({
    type: types.SHOW_DELETE_DIALOG,
    orderId,
  }),

  // 隐藏删除对话框的action
  hideDeleteDialog: () => ({
    type: types.HIDE_DELETE_DIALOG,
  }),

  // 被评价的订单显示评价区域
  showCommentArea: (orderId) => ({
    type: types.SHOW_COMMENT_AREA,
    orderId,
  }),

  // 隐藏订单评价区域
  hideCommentArea: () => ({
    type: types.HIDE_COMMENT_AREA,
  }),

  // 设置评价内容
  setComment: (comment) => ({
    type: types.SET_COMMENT,
    comment,
  }),

  // 设置评价星级
  setStars: (stars) => ({
    type: types.SET_STARS,
    stars,
  }),

  // 提交评论
  submitComment: () => {
    return (dispatch, getState) => {
      dispatch(postCommentRequest());
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const {
            currentOrder: { id, stars, comment },
          } = getState().user;

          // 一条评论对象
          const commentObj = {
            id: +new Date(),
            stars: stars,
            content: comment,
          };
          dispatch(postCommentSuccess());
          dispatch(commentActions.addComment(commentObj));
          dispatch(orderActions.addComment(id, commentObj.id));
          resolve();
        });
      });
    };
  },
};

const deleteOrderRequest = () => ({
  type: types.DELETE_ORDER_REQUEST,
});

const deleteOrderSuccess = (orderId) => ({
  type: types.DELETE_ORDER_SUCCESS,
  orderId,
});

const fetchOrders = (endpoint) => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_ORDERS_REQUEST,
      types.FETCH_ORDERS_SUCCESS,
      types.FETCH_ORDERS_FAILURE,
    ],
    endpoint,
    schema,
  },
});

// 提交评论
const postCommentRequest = () => ({
  type: types.POST_COMMENT_REQUEST,
});

// 提交评论成功
const postCommentSuccess = () => ({
  type: types.POST_COMMENT_SUCCESS,
});

// reducers
const orders = (state = initialState.orders, action) => {
  switch (action.type) {
    case types.FETCH_ORDERS_REQUEST:
      return { ...state, isFetching: true };
    case types.FETCH_ORDERS_SUCCESS:
      // 按类别处理不同种类的订单（待付款、可用、退款）
      const toPayIds = action.response.ids.filter(
        (id) => action.response.orders[id].type === TO_PAY_TYPE
      );
      const availableIds = action.response.ids.filter(
        (id) => action.response.orders[id].type === AVAILABLE_TYPE
      );
      const refundIds = action.response.ids.filter(
        (id) => action.response.orders[id].type === REFUND_TYPE
      );
      return {
        ...state,
        isFetching: false,
        fetched: true,
        ids: state.ids.concat(action.response.ids),
        toPayIds: state.toPayIds.concat(toPayIds),
        availableIds: state.availableIds.concat(availableIds),
        refundIds: state.refundIds.concat(refundIds),
      };
    case types.FETCH_ORDERS_FAILURE:
      return { ...state, isFetching: false };
    case orderTypes.DELETE_ORDER:
    case types.DELETE_ORDER_SUCCESS:
      return {
        ...state,
        ids: removeOrderId(state, "ids", action.orderId),
        toPayIds: removeOrderId(state, "toPayIds", action.orderId),
        availableIds: removeOrderId(state, "availableIds", action.orderId),
        refundIds: removeOrderId(state, "refundIds", action.orderId),
      };

    // 将提交的购买订单同步到个人中心页中
    case orderTypes.ADD_ORDER:
      const { order } = action;
      // key是对应分类数组的名称
      const key = typeToKey[order.type];
      return key
        ? {
            ...state,
            ids: [order.id].concat(state.ids),
            [key]: [order.id].concat(state[key]),
          }
        : { ...state, ids: [order.id].concat(state.ids) };
    default:
      return state;
  }
};

// 设置currentTab的reducer
const currentTab = (state = initialState.currentTab, action) => {
  switch (action.type) {
    case types.SET_CURRENT_TAB:
      return action.index;
    default:
      return state;
  }
};

// 获取当前处理（删除）订单的信息的reducer
const currentOrder = (state = initialState.currentOrder, action) => {
  switch (action.type) {
    case types.SHOW_DELETE_DIALOG:
      return { ...state, id: action.orderId, isDeleting: true };

    case types.SHOW_COMMENT_AREA:
      return { ...state, id: action.orderId, isCommenting: true };
    case types.HIDE_COMMENT_AREA:
    case types.HIDE_DELETE_DIALOG:
    // 处理删除订单的action
    case types.DELETE_ORDER_SUCCESS:
    case types.DELETE_ORDER_FAILURE:
    // 提交评论成功和失败
    case types.POST_COMMENT_SUCCESS:
    case types.POST_COMMENT_FAILURE:
      return initialState.currentOrder;
    // 更改评价
    case types.SET_COMMENT:
      return { ...state, comment: action.comment };
    // 更改评价的星级
    case types.SET_STARS:
      return { ...state, stars: action.stars };
    default:
      return state;
  }
};

const reducer = combineReducers({ orders, currentTab, currentOrder });

export default reducer;

const removeOrderId = (state, key, orderId) => {
  return state[key].filter((id) => {
    return id !== orderId;
  });
};

// selectors
// 获取currentTab
export const getCurrentTab = (state) => {
  return state.user.currentTab;
};

// 获取订单信息
export const getOrders = (state) => {
  const key = ["ids", "toPayIds", "availableIds", "refundIds"][
    state.user.currentTab
  ];
  return state.user.orders[key].map((id) => {
    return getOrderById(state, id);
  });
};

// selectors
// 获取哪一个订单正在处于删除状态
export const getDeletingOrderId = (state) => {
  return state.user.currentOrder && state.user.currentOrder.isDeleting
    ? state.user.currentOrder.id
    : null;
};

// 获取正在评价的订单id
export const getCommentingOrderId = (state) => {
  return state.user.currentOrder && state.user.currentOrder.isCommenting
    ? state.user.currentOrder.id
    : null;
};

// 获取当前的评论信息
export const getCurrentOrderComment = (state) => {
  return state.user.currentOrder ? state.user.currentOrder.comment : null;
};

// 获取当前评价的星级
export const getCurrentOrderStars = (state) => {
  // 默认评分为0
  return state.user.currentOrder ? state.user.currentOrder.stars : 0;
};

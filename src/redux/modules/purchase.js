import { getProductDetail } from "./entities/products";
import { AVAILABLE_TYPE, actions as orderActions } from "./entities/orders";
import { createSelector } from "reselect";

const initialState = {
  quantity: 1, // 购买产品数量
  showTip: false, // 是否显示购买成功的提示框
};

export const types = {
  SET_ORDER_QUANTITY: "PURCHASE/SET_ORDER_QUANTITY", // 设置购买数量
  CLOSE_TIP: "PURCHASE/CLOSE_TIP", // 关闭购买成功提示框

  // 提交订单的一组actionType
  SUBMIT_ORDER_REQUEST: "PURCHASE/SUBMIT_ORDER_REQUEST",
  SUBMIT_ORDER_SUCCESS: "PURCHASE/SUBMIT_ORDER_SUCCESS",
  SUBMIT_ORDER_FAILURE: "PURCHASE/SUBMIT_ORDER_FAILURE",
};

// action creators
export const actions = {
  // 修改订单数量
  setOrderQuantity: (quantity) => ({
    type: types.SET_ORDER_QUANTITY,
    quantity,
  }),

  // 关闭购买成功提示框
  closeTip: () => ({
    type: types.CLOSE_TIP,
  }),

  // 提交订单
  submitOrder: (productId) => {
    return (dispatch, getState) => {
      dispatch({ type: types.SUBMIT_ORDER_REQUEST });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // 获取product详细信息
          const product = getProductDetail(getState(), productId);
          const quantity = getState().purchase.quantity;
          const totalPrice = (product.currentPrice * quantity).toFixed(1);
          const text1 = `${quantity}张 | 总价${totalPrice}`;
          const text2 = product.validityPeriod;

          // 创建完整的订单对象
          const order = {
            title: `${product.shop}：${product.product}`,
            orderPicUrl: product.picture,
            channel: "团购",
            statusText: "待消费",
            text: [text1, text2],
            type: AVAILABLE_TYPE,
          };

          dispatch(orderActions.addOrder(order));
          dispatch({ type: types.SUBMIT_ORDER_SUCCESS });
        }, 500);

        // resolve();
      });
    };
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_ORDER_QUANTITY:
      return { ...state, quantity: action.quantity };
    case types.CLOSE_TIP:
      return { ...state, showTip: false };
    case types.SUBMIT_ORDER_SUCCESS:
      return { ...state, showTip: true };
    default:
      return state;
  }
};

export default reducer;

// selectors

export const getQuantity = (state) => {
  return state.purchase.quantity;
};

export const getTipStatus = (state) => {
  return state.purchase.showTip;
};

// 获取产品详情
// 整个Redux状态模块层设计成了两层，entities下的状态模块是基础的领域数据对应的状态模块，这一层不希望让视图层的组件有所感知
// 希望视图层的组件直接使用modules下的状态模块，不要去关注领域实体内状态模块的定义
// 所以需要再调用一层getProductDetail
// 体现了分层的原则
export const getProduct = (state, productId) => {
  return getProductDetail(state, productId);
};

// 获取提交订单页面商品的总额，根据商品单价和商品数量计算得到
// 使用reselect进行改造
export const getTotalPrice = createSelector(
  [getProduct, getQuantity],
  (product, quantity) => {
    if (!product) {
      return 0;
    }
    return (product.currentPrice * quantity).toFixed(1);
  }
);

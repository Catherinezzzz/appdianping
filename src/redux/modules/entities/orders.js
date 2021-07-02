import createReducer from "../../../utils/createReducer";
export const schema = {
  name: "orders",
  id: "id",
};

let orderIdCounter = 10;

export const USED_TYPE = 1; // 已消费
export const TO_PAY_TYPE = 2; // 待付款
export const AVAILABLE_TYPE = 3; // 可使用
export const REFUND_TYPE = 4; // 退款

export const types = {
  // 删除订单
  DELETE_ORDER: "ORDERS/DELETE_ORDER",

  // 新增评价
  ADD_COMMENT: "ORDERS/ADD_COMMENT",

  // 新增订单
  ADD_ORDER: "ORDER/ADD_ORDER",
};

export const actions = {
  // 删除orders entities中的订单
  deleteOrder: (orderId) => ({
    type: types.DELETE_ORDER,
    orderId,
  }),

  // 新增订单中的评价
  addComment: (orderId, commentId) => ({
    type: types.ADD_COMMENT,
    orderId,
    commentId,
  }),

  // 增加订单
  addOrder: (order) => {
    const orderId = `o-${orderIdCounter++}`;
    return {
      type: types.ADD_ORDER,
      orderId,
      order: { ...order, id: orderId },
    };
  },
};

const normalReducer = createReducer(schema.name);

const reducer = (state = {}, action) => {
  if (action.type === types.ADD_COMMENT) {
    return {
      ...state,
      [action.orderId]: {
        ...state[action.orderId],
        commentId: action.commentId,
      },
    };
  }
  if (action.type === types.ADD_ORDER) {
    return {
      ...state,
      [action.orderId]: action.order,
    };
  }

  if (action.type === types.DELETE_ORDER) {
    // 把目标订单单独拿出来，剩下的就是已经删除目标订单的所有订单
    const { [action.orderId]: deleteOrder, ...restOrders } = state;
    return restOrders;
  } else {
    // 不删除订单，按照原来的方式创建reducer
    return normalReducer(state, action);
  }
};

export default reducer;

// selector
export const getOrderById = (state, id) => {
  return state.entities.orders[id];
};

// 定义商品领域实体的schema
// name属性代表当前领域实体的名字（类似数据库的表名）

import createReducer from "../../../utils/createReducer";

// id属性表示当前领域实体的哪一个字段是用来作为ID来检索数据的（类似数据库的主键）
export const schema = {
  name: "products",
  id: "id",
};

// const reducer = (state = {}, action) => {
//   if (action.response && action.response.products) {
//     return { ...state, ...action.response.products };
//   }
//   return state;
// };

const reducer = createReducer(schema.name);

// selector函数

// 获取商品详情信息
export const getProductDetail = (state, id) => {
  // 注意，首页中获取的商品数据只包含了基础的信息，并不包含商品的详情字段（比较mock数据 product_detail 和 products 中的字段）
  // 不能单纯判断是否存在product，来决定是否要请求商品详情信息
  // 需要加上商品详情信息是否存在的判断
  const product = state.entities.products[id];
  // 包含了详情数据的product对象
  return product && product.detail && product.purchaseNotes ? product : null;
};

// 根据id返回product，不关心product是否包含详情信息
export const getProductById = (state, id) => {
  // 返回product对象
  return state.entities.products[id];
};

export default reducer;

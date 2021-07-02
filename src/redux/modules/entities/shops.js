import createReducer from "../../../utils/createReducer";
export const schema = {
  id: "id",
  name: "shops",
};

const reducer = createReducer(schema.name);

// selector函数
export const getShopById = (state, id) => {
  console.log("state.entities.shops", state);
  const shop = state.entities.shops[id];
  console.log(shop);
  return shop;
};

export default reducer;

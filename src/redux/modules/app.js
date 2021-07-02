// 通用基础状态模块

// 初始状态
const initialState = {
  error: null,
};

// actionTypes
export const types = {
  CLEAR_ERROR: "APP/CLEAR_ERROR",
};

// actionCreators
export const actions = {
  clearError: () => ({
    type: types.CLEAR_ERROR,
  }),
};

const reducer = (state = initialState, action) => {
  const { type, error } = action;
  if (type === types.CLEAR_ERROR) {
    return { ...state, error: null };
  } else if (error) {
    // action当中有error字段（api中间件封装的）
    return { ...state, error: error };
  }
  return state;
};

// selectors，用于获取某一部分的state
export const getError = (state) => {
  return state.app.error;
};

export default reducer;

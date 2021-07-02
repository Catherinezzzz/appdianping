/**
 * 创建每一个领域实体对应的Redux模块中需要使用的reducer
 * @param {*} name
 * @returns
 */
const createReducer = (name) => {
  return (state = {}, action) => {
    if (action.response && action.response[name]) {
      return { ...state, ...action.response[name] };
    }
    return state;
  };
};

export default createReducer;

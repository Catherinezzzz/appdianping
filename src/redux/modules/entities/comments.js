import createReducer from "../../../utils/createReducer";
export const schema = {
  name: "comments",
  id: "id",
};

export const types = {
  ADD_COMMENT: "COMMENT/ADD_COMMENT",
};

export const actions = {
  addComment: (comment) => ({
    type: types.ADD_COMMENT,
    comment,
  }),
};

const normalReducer = createReducer(schema.name);

const reducer = (state = {}, action) => {
  if (action.type === types.ADD_COMMENT) {
    // 添加属性，key值是评论的id，内容是评论对象
    return { ...state, [action.comment.id]: action.comment };
  } else {
    return normalReducer(state, action);
  }
};

export default reducer;

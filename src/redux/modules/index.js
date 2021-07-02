import { combineReducers } from "redux";
import entities from "./entities";
import home from "./home";
import detail from "./detail";
import app from "./app";
import search from "./search";
import login from "./login";
import user from "./user";
import purchase from "./purchase";

// 合并领域实体状态 + UI状态 + 前端通用基础状态，合并成根reducer
const rootReducer = combineReducers({
  entities,
  home,
  detail,
  app,
  search,
  login,
  user,
  purchase,
});

export default rootReducer;

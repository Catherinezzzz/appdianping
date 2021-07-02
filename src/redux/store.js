import { applyMiddleware, createStore } from "redux";
import rootReducer from "./modules";
import thunk from "redux-thunk";
// 封装的处理网络请求的中间件
import api from "./middleware/api";

let store;
// 判断当前程序是否在生产环境下运行 以及 浏览器是否安装了REDUX_DEVTOOLS
if (
  process.env.NODE_ENV !== "production" &&
  window.__REDUX_DEVTOOLS_EXTENSION__
) {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk, api))
  );
} else {
  store = createStore(rootReducer, applyMiddleware(thunk, api));
}

// const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;

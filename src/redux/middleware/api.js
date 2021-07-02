// 封装网络请求层的中间件

import { get } from "../../utils/request";

// 需要经过这个中间件处理的action所具有的标识
export const FETCH_DATA = "FETCH_DATA";

// next代表当前中间件的下一个中间件提供的dispatch方法
const api = (store) => (next) => (action) => {
  const callAPI = action[FETCH_DATA];

  // 如果callAPI是undefined，表明当前接收的action不是一个请求数据的action，而是一个其他类型的action
  if (typeof callAPI === "undefined") {
    // 直接放过对这个action的处理，直接将action交给后面的中间件
    return next(action);
  }

  // 请求数据的action对应三个属性：
  // endpoint: 请求的URL
  // schema: 请求所对应的实体(类似表名)
  // types: 网络请求所对应的三个actionType
  const { endpoint, schema, types } = callAPI;

  if (typeof endpoint !== "string") {
    throw new Error("请求的URL必须是字符串！");
  }

  if (!schema) {
    throw new Error("未指定领域实体！");
  }

  if (!Array.isArray(types) && types.length !== 3) {
    throw new Error("需要指定一个包含了三个actionType的数组");
  }
  // types数组中的每一项actionType都必须是字符串类型
  if (!types.every((type) => typeof type === "string")) {
    throw new Error("actionType必须为字符串类型的数据");
  }

  const actionWithData = (data) => {
    const finalAction = { ...action, ...data };
    delete finalAction[FETCH_DATA];
    return finalAction;
  };

  const [requestType, successType, failureType] = types;

  // 发送successType之前，先发送requestType，表明有一个请求即将被发送
  next(actionWithData({ type: requestType }));

  return fetchData(endpoint, schema).then(
    (response) => {
      return next(
        actionWithData({
          type: successType,
          response,
        })
      );
    },
    // 请求调用失败的场景
    (error) =>
      next(
        actionWithData({
          type: failureType,
          error: error.message || "获取数据失败",
        })
      )
  );
};

// 执行网络请求
const fetchData = (endpoint, schema) => {
  return get(endpoint).then((data) => {
    return normalizeData(data, schema);
  });
};

/**
 * 根据schema, 将获取的数组扁平化处理
 * @param {*} data
 * @param {*} schema
 * @returns
 */
const normalizeData = (data, schema) => {
  // 解析schema的id和name
  const { id, name } = schema;

  // 最后存储扁平化数据的变量
  let kvObj = {};
  // 存储请求到的数据的每一项的id，以保证获取到数据列表的有序性
  let ids = [];

  // 请求到的数据是数组类型
  if (Array.isArray(data)) {
    data.forEach((item) => {
      kvObj[item[id]] = item;
      // 保证数据有序性
      ids.push(item[id]);
    });
  } else {
    // 请求到的数据只是一个对象
    kvObj[data[id]] = data;
    ids.push(data[id]);
  }

  return {
    [name]: kvObj,
    ids,
  };
};

export default api;

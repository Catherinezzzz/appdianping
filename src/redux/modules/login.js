const initialState = {
  username: localStorage.getItem("username") || "",
  password: "",
  isFetching: false,
  status: localStorage.getItem("login") || false, // 登录态标识
};

// actionTypes
export const types = {
  // 登录相关的actionType
  LOGIN_REQUEST: "LOGIN/LOGIN_REQUEST",
  LOGIN_SUCCESS: "LOGIN/LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN/LOGIN_FAILURE",
  // 注销相关的actionType
  LOGOUT: "LOGIN/LOGOUT",
  // 输入框中内容发生变化时触发这个actionType
  SET_USERNAME: "LOGIN/SET_USERNAME",
  SET_PASSWORD: "LOGIN/SET_PASSWORD",
};

// action Creators
export const actions = {
  // 异步action，执行登录。前端模拟登录过程
  login: () => {
    return (dispatch, getState) => {
      const { username, password } = getState().login;
      if (
        !(username && username.length > 0 && password && password.length > 0)
      ) {
        // 输入的用户名和密码不合法
        return dispatch(loginFailure(""));
      }
      dispatch(loginRequest());
      // 模拟异步操作，1秒后登录成功
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          dispatch(loginSuccess());
          // 登录成功后将用户名和标识是否已经登录过的登录状态存储到localStorage当中
          localStorage.setItem("username", username);
          localStorage.setItem("login", true);
          resolve();
        }, 1000);
      });
    };
  },

  // 登出的actionCreator,只需要将登录状态status置为false（前端简单模拟）
  logout: () => {
    // 注销时清除登录相关信息
    localStorage.removeItem("username");
    localStorage.removeItem("login");

    return { type: types.LOGOUT };
  },

  // 修改登陆名
  setUsername: (username) => ({
    type: types.SET_USERNAME,
    username,
  }),

  // 修改密码
  setPassword: (password) => ({
    type: types.SET_PASSWORD,
    password,
  }),
};

const loginRequest = () => ({
  type: types.LOGIN_REQUEST,
});

const loginSuccess = () => ({
  type: types.LOGIN_SUCCESS,
});

const loginFailure = (error) => ({
  type: types.LOGIN_FAILURE,
  error,
});

// reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOGIN_REQUEST:
      return { ...state, isFetching: true };
    case types.LOGIN_SUCCESS:
      return { ...state, isFetching: false, status: true };
    case types.LOGIN_FAILURE:
      return { ...state, isFetching: false };
    case types.LOGOUT:
      return { ...state, status: false, username: "", password: "" };
    case types.SET_USERNAME:
      return { ...state, username: action.username };
    case types.SET_PASSWORD:
      return { ...state, password: action.password };
    default:
      return state;
  }
};

export default reducer;

// selectors
export const getUsername = (state) => {
  return state.login.username;
};

export const getPassword = (state) => {
  return state.login.password;
};

export const isLogin = (state) => {
  return state.login.status;
};
